
import { prisma } from "@/lib/prisma";
import { generateJSON, MODEL_CONFIGS } from "@/lib/gemini";
import type { ProfileAnalysisResult } from "@/types/ai";
import { updateStreak } from "@/lib/achievement-service";
import crypto from "crypto";

/**
 * Service to analyze user interactions and update their profile.
 * This acts as the "Long Term Memory" and "Proactive Agent" for the mentor.
 */

// ============================================================================
// Types
// ============================================================================


// ============================================================================
// Core Analysis Logic
// ============================================================================

/**
 * Analyze a user's recent activity and update their profile analysis
 */
export async function analyzeUserProfile(userId: string) {
    console.log(`[Analysis Service] Starting analysis for user ${userId}`);

    // 0. Update Streak (Daily Engagement)
    await updateStreak(userId).catch(e => console.error("Streak update failed", e));

    // 1. Fetch recent data
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            progress: true,
            conversations: {
                take: 20, // Analyze last 20 messages
                orderBy: { createdAt: "desc" },
            },
            taskProgress: {
                take: 10,
                orderBy: { updatedAt: "desc" },
                include: { task: true },
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // 2. Prepare data for global context
    const conversationHistory = user.conversations
        .reverse() // Chronological order
        .map((c) => `${c.role === "assistant" ? "Mentor" : "Learner"}: ${c.content} `)
        .join("\n");

    const taskHistory = user.taskProgress
        .map((tp) => `- Task: ${tp.task.title} (${tp.completed ? "Completed" : "In Progress"}) - Notes: ${tp.notes || "None"} `)
        .join("\n");

    const prompt = `
  Analyze this learner's recent activity to update their mentorship profile.
  
  LEARNER CONTEXT:
- Track: ${user.profile?.careerTrack || "Unknown"}
- Level: ${user.profile?.learningLevel || "Unknown"}
- Recent Progress: ${user.progress[0]?.progressPercent || 0}%

    RECENT CONVERSATIONS:
  ${conversationHistory}
  
  RECENT TASKS:
  ${taskHistory}

OBJECTIVE:
  Identify the learner's current state, learning style, and specific needs.
  Generate proactive insights to help them succeed.
  
  RETURN JSON OBJECT:
{
    "summary": "1-2 sentence high-level summary of their current status and mood",
        "strengths": ["list", "of", "detected", "strengths"],
            "weaknesses": ["list", "of", "struggles", "or", "gaps"],
                "learningStyle": "visual|hands-on|theoretical|mixed",
                    "insights": [
                        {
                            "type": "recommendation|encouragement|warning",
                            "content": "Specific, actionable advice or message",
                            "priority": "high|medium|low"
                        }
                    ]
}
`;

    // 2.5 Generate Hash of inputs to check cache
    const inputString = JSON.stringify({
        track: user.profile?.careerTrack,
        level: user.profile?.learningLevel,
        progress: user.progress[0]?.progressPercent,
        conversations: conversationHistory, // already last 20
        tasks: taskHistory
    });

    const inputHash = crypto.createHash('sha256').update(inputString).digest('hex');

    // CHECK CACHE
    const lastAnalysis = await prisma.userProfileAnalysis.findUnique({
        where: { userId }
    });

    if (lastAnalysis && lastAnalysis.inputHash === inputHash) {
        console.log(`[Analysis Service] Cache HIT for user ${userId}`);
        // Return existing analysis mapped to ProfileAnalysisResult
        // Note: DB stores flattened fields, we need to reconstruct object
        return {
            summary: lastAnalysis.summary,
            strengths: lastAnalysis.strengths,
            weaknesses: lastAnalysis.weaknesses,
            learningStyle: lastAnalysis.learningStyle,
            insights: [] // We don't store raw insights array in ProfileAnalysis model, just created MentorInsights
        };
    }

    console.log(`[Analysis Service] Cache MISS for user ${userId}`);

    // 3. Generate analysis using Gemini
    try {
        const analysis = await generateJSON<ProfileAnalysisResult>(
            prompt,
            MODEL_CONFIGS.PRECISE
        );

        // 4. Update Database

        // Update Profile Analysis
        await prisma.userProfileAnalysis.upsert({
            where: { userId },
            create: {
                userId,
                summary: analysis.summary,
                strengths: analysis.strengths,
                weaknesses: analysis.weaknesses,
                learningStyle: analysis.learningStyle,
                inputHash: inputHash, // Save the hash
            },
            update: {
                summary: analysis.summary,
                strengths: analysis.strengths,
                weaknesses: analysis.weaknesses,
                learningStyle: analysis.learningStyle,
                lastAnalyzedAt: new Date(),
                inputHash: inputHash // Save the hash
            },
        });

        // Create New Insights (if high priority or user has few insights)
        // We filter to avoid spamming - only add high priority or if list is empty
        if (analysis.insights && analysis.insights.length > 0) {
            for (const insight of analysis.insights) {
                // Check if similar insight exists to avoid duplicates (naive check)
                const existing = await prisma.mentorInsight.findFirst({
                    where: {
                        userId,
                        content: insight.content,
                        isRead: false
                    }
                });

                if (!existing) {
                    await prisma.mentorInsight.create({
                        data: {
                            userId,
                            type: insight.type,
                            content: insight.content,
                            // Set expiration for 3 days from now
                            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                        }
                    });
                }
            }
        }

        console.log(`[Analysis Service] Analysis complete for user ${userId}`);
        return analysis;

    } catch (error) {
        console.error(`[Analysis Service] Error analyzing user ${userId}: `, error);
        throw error;
    }
}
