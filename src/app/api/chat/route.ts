"use server";

import { NextResponse } from "next/server";
import { generateText, MODEL_CONFIGS } from "@/lib/gemini";
import { buildVoiceChatPrompt } from "@/lib/ai-prompts";
import type { ConversationContext, ConversationMessage } from "@/types/ai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/chat
 * 
 * Handle text-based conversations with AI mentor
 * Used by both voice (after transcription) and text chat modes
 */
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // Check authentication
    const session = await auth();
    const userId = session?.user ? (session.user as any).id : null;

    // Parse request body
    const body = await request.json();
    const {
      message,
      context,
      conversationHistory,
    } = body as {
      message: string;
      context: ConversationContext;
      conversationHistory?: Array<{ role: string; content: string }>;
    };

    // Validate required fields
    if (!message || !context) {
      return NextResponse.json(
        { error: "Missing required fields: message and context" },
        { status: 400 }
      );
    }

    console.log(`[Chat API] Received message: "${message}"`);

    // Convert conversation history to expected format
    const formattedHistory: ConversationMessage[] = conversationHistory
      ? conversationHistory.map((msg, index) => ({
        role: msg.role === "assistant" ? "mentor" : "user",
        content: msg.content,
        timestamp: new Date(),
      }))
      : [];

    let systemPromptContext = context;

    // Inject User Profile if available
    if (userId) {
      const userProfile = await prisma.userProfileAnalysis.findUnique({
        where: { userId },
      });

      if (userProfile) {
        // Enriched context with long-term memory
        const profileContext = `\n\nLONG-TERM MEMORY (USER PROFILE):\n- Summary: ${userProfile.summary}\n- Strengths: ${userProfile.strengths.join(", ")}\n- Weaknesses: ${userProfile.weaknesses.join(", ")}\n- Learning Style: ${userProfile.learningStyle || "Unknown"}\n\nADAPT YOUR RESPONSE TO THIS PROFILE.`;

        // We append this to the system prompt implicitly by modifying the context object passed to buildVoiceChatPrompt
        // Since context is a typed object, we can't easily add dynamic fields without changing the type.
        // Instead, we'll prepend this to the message or modify the prompt builder.
        // For minimal invasion, we'll actually fetch the prompt and append this section.
        // However, buildVoiceChatPrompt takes context. Let's wrap the message with this context for now as a "System Note"

        // Better approach: Let's modify the message to include this context for the AI (invisible to user)
        // But we want it in the system instruction part.
        // Let's modify the buildVoiceChatPrompt call to include an optional "systemNote" if we supported it, 
        // but since we don't want to change the library, we will prepend it to the conversation history as a "system" message if possible,
        // OR just append it to the system prompt returned by buildVoiceChatPrompt if we could intercept it.

        // Simplest valid approach with current codebase:
        // We will modify the 'context' object effectively for the prompt generation if it allows extra fields,
        // or we just assume the prompt builder won't use it but we can append it to the final prompt string.
      }

      // TRIGGER ANALYSIS (Lazy approach: 1 in 10 chance to update profile after a message)
      if (Math.random() < 0.1) {
        // Run in background - don't await
        import("@/lib/analysis-service").then(service => {
          service.analyzeUserProfile(userId).catch(err => console.error("Background analysis failed", err));
        });
      }
    }

    // Generate AI response using voice-optimized prompt
    let prompt = buildVoiceChatPrompt(message, context, formattedHistory);

    // Inject memory manually into the prompt string until we update the prompt builder
    if (userId) {
      const userProfile = await prisma.userProfileAnalysis.findUnique({ where: { userId } });
      if (userProfile) {
        prompt = prompt.replace("YOUR ROLE:", `LONG-TERM USER PROFILE:\n- Summary: ${userProfile.summary}\n- Strengths: ${userProfile.strengths.join(", ")}\n- Weaknesses: ${userProfile.weaknesses.join(", ")}\n- Learning Style: ${userProfile.learningStyle}\n\nYOUR ROLE:`);
      }
    }

    const response = await generateText(prompt, MODEL_CONFIGS.BALANCED, {
      timeout: 10000,
    });

    const duration = Date.now() - startTime;

    console.log(
      `[Chat API] Response: "${response.substring(0, 100)}..." (${duration}ms)`
    );

    // Save conversation to database if user is authenticated
    if (userId) {
      try {
        // Save user message
        await prisma.conversation.create({
          data: {
            userId,
            role: "user",
            content: message,
            context: context as any,
          },
        });

        // Save AI response
        await prisma.conversation.create({
          data: {
            userId,
            role: "assistant",
            content: response.trim(),
            context: context as any,
            duration,
            model: "gemini-2.0-flash",
          },
        });

        console.log(`[Chat API] Saved conversation to database`);
      } catch (dbError) {
        console.error("[Chat API] Failed to save conversation:", dbError);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      response: response.trim(),
      duration,
      model: "gemini-2.0-flash",
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);

    // Log full error details for debugging
    if (error instanceof Error) {
      console.error("[Chat API] Error name:", error.name);
      console.error("[Chat API] Error message:", error.message);
      console.error("[Chat API] Error stack:", error.stack);
    }

    // Determine error type and provide helpful message
    let errorMessage = "Failed to process message";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY") || error.message.includes("API key")) {
        errorMessage = "AI service not configured. Please add GEMINI_API_KEY to .env";
        statusCode = 503;
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
        statusCode = 504;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: statusCode }
    );
  }
}
