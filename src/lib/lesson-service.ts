
import { prisma } from "@/lib/prisma";
import { generateJSON, MODEL_CONFIGS } from "@/lib/gemini";
import { buildLessonPrompt } from "@/lib/ai-prompts";
import { LessonGenerationResponse } from "@/types/ai";

/**
 * Service to generate dynamic, personalized lessons (Concept Cards)
 */

export async function generateLesson(
    userId: string,
    topic: string,
    options?: {
        careerTrack?: string;
        phase?: string;
        level?: string;
        focusArea?: string;
        estimatedMinutes?: number;
    }
): Promise<LessonGenerationResponse> {
    console.log(`[Lesson Service] Generating lesson for user ${userId} on topic "${topic}"`);

    // 1. Fetch User Profile for Personalization
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, profileAnalysis: true }
    });

    if (!user || !user.profile) {
        throw new Error("User profile not found");
    }

    const track = (options?.careerTrack || user.profile.careerTrack) as any;
    const level = (options?.level || user.profile.learningLevel) as any;
    const phase = (options?.phase || "fundamentals") as any;

    // 2. Build Prompt
    let prompt = buildLessonPrompt(track, phase, topic, level);

    if (options?.focusArea) {
        prompt += `\nFOCUS AREA: ${options.focusArea}\n`;
    }

    if (options?.estimatedMinutes) {
        prompt += `\nTARGET DURATION: ${options.estimatedMinutes} minutes\n`;
    }

    if (user.profileAnalysis) {
        const style = user.profileAnalysis.learningStyle;
        const strengths = user.profileAnalysis.strengths.join(", ");

        prompt += `\n\nPERSONALIZATION INSTRUCTION:
        The learner is a "${style}" learner.
        Strengths: ${strengths}.
        
        Identify specific analogies that would work well for a ${style} learner.
        For example, if Visual, use visual metaphors.
        `;
    }

    // 3. Generate Content
    try {
        const lesson = await generateJSON<LessonGenerationResponse>(
            prompt,
            MODEL_CONFIGS.CREATIVE
        );

        return lesson;
    } catch (error) {
        console.error("Lesson generation failed:", error);
        if (error instanceof Error) {
            console.error("Error Message:", error.message);
            console.error("Error Stack:", error.stack);
        }
        throw new Error(`Failed to generate lesson content: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
