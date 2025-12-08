import { prisma } from "./src/lib/prisma";
import { checkAndAdvanceDay } from "./src/lib/day-progression-service";

const TEST_EMAIL = "test-day-progression@example.com";

async function main() {
    console.log("Testing Automatic Day Progression...\n");

    // 1. Setup test user
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } }).catch(() => { });

    const user = await prisma.user.create({
        data: {
            email: TEST_EMAIL,
            password: "hash",
            profile: {
                create: {
                    careerTrack: "frontend",
                    learningLevel: "beginner"
                }
            },
            progress: {
                create: {
                    planVersion: "v1",
                    currentDay: 1,
                    totalDays: 14,
                    progressPercent: 7,
                    // Set last active to 25 hours ago
                    lastActiveDate: new Date(Date.now() - 25 * 60 * 60 * 1000)
                }
            }
        }
    });

    console.log(`✓ Created test user (Day 1, last active 25 hours ago)`);

    // 2. Test day progression
    const result = await checkAndAdvanceDay(user.id);

    console.log(`\nProgression Result:`);
    console.log(`  Advanced: ${result.advanced}`);
    console.log(`  New Day: ${result.newDay || "N/A"}`);
    console.log(`  Message: ${result.message}`);

    // 3. Verify database update
    const updatedProgress = await prisma.userProgress.findFirst({
        where: { userId: user.id, planVersion: "v1" }
    });

    console.log(`\nDatabase State:`);
    console.log(`  Current Day: ${updatedProgress?.currentDay}`);
    console.log(`  Progress %: ${updatedProgress?.progressPercent}`);
    console.log(`  Last Active: ${updatedProgress?.lastActiveDate}`);

    // 4. Test no advancement (less than 24 hours)
    console.log(`\n--- Testing No Advancement (< 24 hours) ---`);
    const result2 = await checkAndAdvanceDay(user.id);
    console.log(`  Advanced: ${result2.advanced}`);
    console.log(`  Message: ${result2.message}`);

    // Verify
    if (result.advanced && result.newDay === 2) {
        console.log(`\n✅ SUCCESS: Day progression working correctly!`);
    } else {
        console.error(`\n❌ FAILURE: Expected advancement to Day 2`);
        process.exit(1);
    }

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
