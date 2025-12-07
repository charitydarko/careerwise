

import { NextResponse } from "next/server";
import { generateLesson } from "@/lib/lesson-service";
import { auth } from "@/lib/auth";
import type { LessonGenerationRequest } from "@/types/ai";

/**
 * POST /api/ai/generate-lesson
 *
 * Generates an in-platform lesson outline for a given topic.
 * Uses the centralized LessonService for deep personalization.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    // Allow anonymous use? The service explicitly fetches user profile.
    // If no session, we can't use the service as intended for personalization.
    // But the old route allowed authenticated check but seemingly didn't enforce it strictly for prompts?
    // Actually lines 52-59 in old route fetched profile.
    // If no session, we can't get userId.

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = (await req.json()) as Partial<LessonGenerationRequest>;
    const { topic, difficulty, careerTrack, estimatedMinutes, focusArea } =
      body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const lesson = await generateLesson(userId, topic, {
      careerTrack,
      level: difficulty,
      estimatedMinutes,
      focusArea,
      phase: "fundamentals" // Default phase if not provided
    });

    return NextResponse.json(lesson);

  } catch (error) {
    console.error("[generate-lesson] Error:", error);

    // Propagate error message
    const message = error instanceof Error ? error.message : "Failed to generate lesson";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
