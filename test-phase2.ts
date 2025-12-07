
import { prisma } from "./src/lib/prisma";

async function main() {
    console.log("Starting Phase 2 Verification...");

    const email = "test-phase2@example.com";

    // 1. Create/Update User
    console.log("Creating test user...");
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: "Phase2 Tester",
            password: "hashed_password_placeholder",
            profile: {
                create: {
                    careerTrack: "frontend",
                    learningLevel: "beginner",
                }
            }
        },
        include: { profile: true }
    });

    console.log(`User ID: ${user.id}`);

    // 2. Create User Profile Analysis (Visual Learner)
    console.log("Creating UserProfileAnalysis...");
    await prisma.userProfileAnalysis.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            summary: "Visual learner who loves CSS but struggles with logic.",
            strengths: ["CSS", "Design"],
            weaknesses: ["Algorithms", "Async/Await"],
            learningStyle: "Visual",
            lastAnalyzedAt: new Date(),
        },
        update: {
            summary: "Visual learner who loves CSS but struggles with logic.",
            strengths: ["CSS", "Design"],
            weaknesses: ["Algorithms", "Async/Await"],
            learningStyle: "Visual",
        }
    });
    console.log("UserProfileAnalysis created. (This confirms Lesson Generator will have data to use)");

    // 3. Create Unread High Priority Insight
    console.log("Creating proactive Insight...");
    await prisma.mentorInsight.create({
        data: {
            userId: user.id,
            type: "warning",
            content: "Phase 2 Test Insight: Remember to clean up side effects in useEffect!",
            isRead: false,
            expiresAt: new Date(Date.now() + 86400000) // 24h
        }
    });

    // 4. Verify Fetch Logic (Simulate /api/mentor/insights/latest)
    console.log("Verifying Insight Query...");
    const insight = await prisma.mentorInsight.findFirst({
        where: {
            userId: user.id,
            isRead: false,
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (insight && insight.content.includes("Phase 2 Test")) {
        console.log("SUCCESS: Retrieved specific proactive insight.");
        console.log("Insight Content:", insight.content);
    } else {
        console.error("FAILURE: Could not retrieve the test insight.");
    }

    console.log("Phase 2 Verification Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
