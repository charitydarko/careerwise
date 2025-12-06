"use server";

import { NextResponse } from "next/server";

import { generateJSON, MODEL_CONFIGS } from "@/lib/gemini";
import type {
  LessonGenerationRequest,
  LessonGenerationResponse,
} from "@/types/ai";
import { AIServiceError } from "@/types/ai";

const SUPPORTED_TRACKS = ["frontend", "data", "cloud", "ux", "backend"];
const SUPPORTED_LEVELS = ["beginner", "intermediate", "advanced"];

/**
 * POST /api/ai/generate-lesson
 *
 * Generates an in-platform lesson outline for a given topic.
 * Returns structured JSON the client can render without extra parsing.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LessonGenerationRequest>;
    const { topic, difficulty, careerTrack, estimatedMinutes, focusArea } =
      body;

    if (!topic || !difficulty || !careerTrack) {
      return NextResponse.json(
        { error: "topic, difficulty, and careerTrack are required" },
        { status: 400 },
      );
    }

    if (!SUPPORTED_TRACKS.includes(careerTrack)) {
      return NextResponse.json(
        { error: `Unsupported careerTrack. Use one of: ${SUPPORTED_TRACKS.join(", ")}` },
        { status: 400 },
      );
    }

    if (!SUPPORTED_LEVELS.includes(difficulty)) {
      return NextResponse.json(
        { error: `Unsupported difficulty. Use one of: ${SUPPORTED_LEVELS.join(", ")}` },
        { status: 400 },
      );
    }

    const targetMinutes = estimatedMinutes ?? 25;

    const prompt = buildLessonPrompt({
      topic,
      difficulty,
      careerTrack,
      estimatedMinutes: targetMinutes,
      focusArea,
    });

    const lesson = await generateJSON<LessonGenerationResponse>(
      prompt,
      MODEL_CONFIGS.PRECISE,
      { timeout: 20000 },
    );

    const response: LessonGenerationResponse = {
      ...lesson,
      title: lesson.title?.trim() || topic,
      estimatedMinutes: lesson.estimatedMinutes || targetMinutes,
      sections: lesson.sections?.slice(0, 4) || [],
      codeExamples: lesson.codeExamples?.slice(0, 3) || [],
      keyTakeaways: lesson.keyTakeaways?.slice(0, 5) || [],
      practice: lesson.practice || {
        prompt: `Practice applying ${topic} with a short example.`,
        steps: [],
      },
      overview:
        lesson.overview?.trim() ||
        `Learn the essentials of ${topic} for ${careerTrack} work.`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[generate-lesson] Error:", error);

    if (error instanceof AIServiceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate lesson content" },
      { status: 500 },
    );
  }
}

function buildLessonPrompt(input: LessonGenerationRequest): string {
  const focus = input.focusArea
    ? `Primary focus: ${input.focusArea}.`
    : "Emphasize practical, immediately usable guidance.";

  return `
You are an expert mentor for ${input.careerTrack} learners.
Create a concise ${input.difficulty} lesson about "${input.topic}" designed to be completed in ${input.estimatedMinutes} minutes.
${focus}

Return a JSON object matching this shape exactly:
{
  "title": string,
  "overview": string, // 2-3 sentences, plain text
  "sections": [
    { "heading": string, "content": string } // 3-4 focused sections, concise paragraphs
  ],
  "codeExamples": [
    {
      "title": string,
      "language": string, // e.g., "typescript", "python"
      "code": string,
      "explanation": string
    }
  ],
  "keyTakeaways": [string], // 3-5 bullet statements
  "practice": {
    "prompt": string,      // short exercise description
    "steps": [string],     // step-by-step guidance (3-5 steps)
    "expectedOutcome": string
  },
  "estimatedMinutes": number
}

Constraints:
- Keep language simple and actionable.
- Prefer real-world mini-scenarios over theory.
- Keep code examples small and runnable without external dependencies.
- Avoid markdown formatting; plain text is fine.
`;
}
