"use server";

import { NextResponse } from "next/server";
import { generateText, MODEL_CONFIGS } from "@/lib/gemini";
import { buildVoiceChatPrompt } from "@/lib/ai-prompts";
import type { ConversationContext, ConversationMessage } from "@/types/ai";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LeaderboardService } from "@/lib/leaderboard-service";

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
    const userId =
      (session?.user as any)?.id || (session?.user as any)?.sub || null;

    if (!session?.user || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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



    // TRIGGER ANALYSIS (Smart approach)
    // 1. If profile is stale (> 24h), trigger update
    // 2. Otherwise small random chance for dynamic events
    const shouldAnalyze = await (async () => {
      if (!userId) return false;

      const profileMeta = await prisma.userProfileAnalysis.findUnique({
        where: { userId },
        select: { lastAnalyzedAt: true }
      });

      if (!profileMeta) return true; // Never analyzed

      const hoursSince = (Date.now() - profileMeta.lastAnalyzedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSince > 24) return true; // Stale

      return Math.random() < 0.05; // 5% chance otherwise
    })();

    if (shouldAnalyze) {
      // Run in background - don't await
      import("@/lib/analysis-service").then(service => {
        service.analyzeUserProfile(userId).catch(err => console.error("Background analysis failed", err));
      });
    }


    // Generate AI response using voice-optimized prompt

    // Fetch profile analysis with insights
    let analysis = null;
    if (userId) {
      const profile = await prisma.userProfileAnalysis.findUnique({
        where: { userId }
      });

      if (profile) {

        // Fetch active insights
        const insights = await prisma.mentorInsight.findMany({
          where: {
            userId,
            isRead: false,
            expiresAt: { gt: new Date() }
          },
          take: 3,
          orderBy: { createdAt: 'desc' }
        });

        // FETCH GAMIFICATION CONTEXT
        const progress = await prisma.userProgress.findFirst({
          where: { userId, planVersion: "v1" }
        });

        const leaderboard = await LeaderboardService.getWeeklyLeaderboard(userId);
        const userRank = leaderboard.find(e => e.isUser)?.rank || 0;

        const achievements = await prisma.userAchievement.findMany({
          where: { userId },
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
          take: 3
        });

        // ENRICH ANALYSIS
        const gamificationContext = {
          level: progress?.level || 1,
          xp: progress?.currentXp || 0,
          rank: userRank,
          recentBadges: achievements.map(ua => ua.achievement.title)
        };

        analysis = {
          ...profile,
          insights: insights.map(i => ({ content: i.content, type: i.type })),
          gamification: gamificationContext
        };
      }
    }

    const prompt = buildVoiceChatPrompt(message, context, formattedHistory, analysis);

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
