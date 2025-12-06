"use server";

import { NextResponse } from "next/server";
import { generateText, MODEL_CONFIGS } from "@/lib/gemini";
import { transcribeAudio, getVoiceProfile } from "@/lib/voice-service";
import { buildVoiceChatPrompt } from "@/lib/ai-prompts";
import type {
  VoiceChatRequest,
  VoiceChatResponse,
  TranscriptionRequest,
} from "@/types/voice";
import type { ConversationMessage } from "@/types/ai";

/**
 * POST /api/voice/chat
 * 
 * Handle voice conversations with AI mentor
 * Flow: Audio → Transcribe → AI Response → Return (TTS happens client-side for now)
 */
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // Parse request body
    const body = await request.json();
    const {
      audio,
      conversationId,
      context,
      conversationHistory,
      options,
    } = body as {
      audio: string; // base64 encoded audio
      conversationId?: string;
      context: VoiceChatRequest["context"];
      conversationHistory?: ConversationMessage[];
      options?: VoiceChatRequest["options"];
    };

    // Validate required fields
    if (!audio || !context) {
      return NextResponse.json(
        { error: "Missing required fields: audio and context" },
        { status: 400 }
      );
    }

    // Step 1: Transcribe user's audio to text
    console.log("[Voice API] Transcribing audio...");
    const transcriptionStart = Date.now();

    // Convert base64 to Blob
    const audioBlob = base64ToBlob(audio);

    const transcriptionRequest: TranscriptionRequest = {
      audio: audioBlob,
      format: "webm", // Assuming WebM, could be detected from MIME type
      language: "en-US",
      context: `Career track: ${context.careerTrack}, Learning level: ${context.learningLevel}`,
    };

    let transcriptionResult;
    try {
      transcriptionResult = await transcribeAudio(transcriptionRequest);
      const transcriptionTime = Date.now() - transcriptionStart;
      console.log(
        `[Voice API] Transcribed: "${transcriptionResult.transcript}" (${transcriptionTime}ms)`
      );
    } catch (transcribeError) {
      console.error("[Voice API] Transcription failed:", transcribeError);
      throw new Error(`Failed to transcribe audio: ${transcribeError instanceof Error ? transcribeError.message : "Unknown error"}`);
    }

    // Step 2: Generate AI response using voice-optimized prompt
    console.log("[Voice API] Generating AI response...");
    const aiStart = Date.now();

    const prompt = buildVoiceChatPrompt(
      transcriptionResult.transcript,
      context,
      conversationHistory
    );

    const mentorResponse = await generateText(prompt, MODEL_CONFIGS.BALANCED, {
      timeout: 10000,
    });

    const aiTime = Date.now() - aiStart;

    console.log(
      `[Voice API] AI Response: "${mentorResponse.substring(0, 100)}..." (${aiTime}ms)`
    );

    // Step 3: Return response
    // Note: TTS happens on client side using Web Speech API for now
    const totalTime = Date.now() - startTime;

    const response: VoiceChatResponse = {
      conversationId: conversationId || generateConversationId(),
      userTranscript: transcriptionResult.transcript,
      mentorResponse: mentorResponse.trim(),
      duration: totalTime,
      metadata: {
        transcriptionConfidence: transcriptionResult.confidence,
        processingTime: totalTime,
        model: "gemini-2.0-flash",
      },
    };

    console.log(`[Voice API] Complete in ${totalTime}ms`);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Voice API] Error:", error);
    
    // Log full error details for debugging
    if (error instanceof Error) {
      console.error("[Voice API] Error name:", error.name);
      console.error("[Voice API] Error message:", error.message);
      console.error("[Voice API] Error stack:", error.stack);
    }

    // Determine error type and provide helpful message
    let errorMessage = "Failed to process voice message";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY") || error.message.includes("API key")) {
        errorMessage = "AI service not configured. Please add GEMINI_API_KEY to .env";
        statusCode = 503;
      } else if (error.message.includes("transcribe") || error.message.includes("audio")) {
        errorMessage = "Failed to transcribe audio. Please try speaking again.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
        statusCode = 504;
      } else if (error.message.includes("Invalid base64")) {
        errorMessage = "Invalid audio data. Please try recording again.";
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

/**
 * Helper: Convert base64 string to Blob
 */
function base64ToBlob(base64: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "audio/webm" });
  } catch (error) {
    throw new Error("Invalid base64 audio data");
  }
}

/**
 * Helper: Generate unique conversation ID
 */
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
