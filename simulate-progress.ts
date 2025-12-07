
import { prisma } from "@/lib/prisma";
import { analyzeUserProfile } from "@/lib/analysis-service";

async function main() {
    const email = "ai_student@example.com";
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error("User not found!");
        process.exit(1);
    }

    console.log("Found user:", user.id);

    // 1. Mark a "Deep Work" task as complete
    // Find a task first
    const tasks = await prisma.task.findMany();
    // Prefer backend deep work, but fallback to any deep work
    let task = tasks.find(t => t.careerTrack === "backend" && t.difficulty === "deep");

    if (!task) {
        task = tasks.find(t => t.difficulty === "deep");
    }

    if (!task) {
        console.error("No deep tasks found available to complete.");
        return;
    }

    console.log("Completing task:", task.title);

    await prisma.taskProgress.upsert({
        where: {
            userId_taskId: { userId: user.id, taskId: task.id }
        },
        update: { completed: true, completedAt: new Date() },
        create: { userId: user.id, taskId: task.id, completed: true, completedAt: new Date() }
    });

    // 2. Trigger Analysis
    console.log("Triggering analysis...");
    try {
        await analyzeUserProfile(user.id);
    } catch (e) {
        console.error("Analysis triggered error (ignoring for simulation):", e);
    }

    // 3. Check for Insight
    const insight = await prisma.mentorInsight.findFirst({
        where: { userId: user.id, isRead: false },
        orderBy: { createdAt: 'desc' }
    });

    if (insight) {
        console.log("SUCCESS: Insight generated:", insight.content);
    } else {
        console.log("Analysis returned no insights. Forcing a test insight for verified UI testing...");
        const newInsight = await prisma.mentorInsight.create({
            data: {
                userId: user.id,
                type: "recommendation",
                content: "Great job on TypeScript! This text verifies the Voice Panel can read proactive insights.",
                isRead: false,
                expiresAt: new Date(Date.now() + 86400000)
            }
        });
        console.log("FORCED SUCCESS: Test insight created:", newInsight.content);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
