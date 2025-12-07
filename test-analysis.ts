
require('dotenv').config();
const { analyzeUserProfile } = require('./src/lib/analysis-service');
const { prisma } = require('./src/lib/prisma');

async function testAnalysis() {
    console.log('🧪 Testing Analysis Service...\n');

    try {
        // 1. Get a test user (or create one if needed)
        // For safety in this environment, we'll try to find an existing user or mock it if strictly unit testing
        // But since we have DB access, let's find the first user
        const user = await prisma.user.findFirst();

        if (!user) {
            console.log('⚠️ No users found in database. Please seed the database first.');
            return;
        }

        console.log(`Found user: ${user.email} (${user.id})`);

        // 2. Run analysis
        console.log('Running analysis...');
        const result = await analyzeUserProfile(user.id);

        console.log('\n✅ Analysis Result:');
        console.log(JSON.stringify(result, null, 2));

        // 3. Verify DB update
        const savedAnalysis = await prisma.userProfileAnalysis.findUnique({
            where: { userId: user.id }
        });

        console.log('\n✅ Saved to DB:');
        console.log(savedAnalysis);

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// We need to handle the import alias for the test to run with plain node
// Since the code uses @/lib/..., we might need ts-node or similar.
// Alternatively, for this quick test, we can rely on the fact that we are in the project root
// and might need to register tsconfig paths or just assume typical Next.js dev environment.
// ACTUALLY: The easiest way to run this in Next.js environment is probably to make a small script
// that is run via `tsx` which is already in package.json devDependencies.

testAnalysis();
