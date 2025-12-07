
import { prisma } from "@/lib/prisma";

/**
 * Constants for Gamification
 */
const XP_PER_LEVEL = 100; // MVP: Flat 100 XP per level for simplicity
const ACHIEVEMENT_RULES = [
    {
        id: "first-lesson",
        name: "First Steps",
        description: "Complete your first lesson",
        check: (stats: any) => stats.lessonsCompleted >= 1
    },
    {
        id: "streak-3",
        name: "On Fire",
        description: "Maintain a 3-day streak",
        check: (stats: any) => stats.streak >= 3
    }
];

export class GamificationService {

    /**
     * Calculate level based on total XP
     */
    static calculateLevel(xp: number): number {
        return Math.floor(xp / XP_PER_LEVEL) + 1;
    }

    /**
     * Award XP to a user and handle level ups
     */
    static async awardXP(userId: string, amount: number) {
        console.log(`[Gamification] Awarding ${amount} XP to user ${userId}`);

        // 1. Fetch current progress
        // We assume planVersion "v1" for now as per schema default
        const progress = await prisma.userProgress.findUnique({
            where: {
                userId_planVersion: {
                    userId,
                    planVersion: "v1"
                }
            }
        });

        if (!progress) {
            console.warn(`[Gamification] No progress record found for user ${userId}`);
            return null;
        }

        // 2. Calculate new state
        const newXp = progress.currentXp + amount;
        const newLevel = this.calculateLevel(newXp);
        const didLevelUp = newLevel > progress.level;

        // 3. Update DB
        const updated = await prisma.userProgress.update({
            where: { id: progress.id },
            data: {
                currentXp: newXp,
                level: newLevel
            }
        });

        // 4. Check Achievements
        const unlockedAchievements = await this.checkAchievements(userId);

        // 5. Return result
        return {
            currentXp: updated.currentXp,
            level: updated.level,
            leveledUp: didLevelUp,
            xpGained: amount,
            newAchievements: unlockedAchievements
        };
    }

    /**
     * Check and unlock achievements based on user stats
     * This is a simplified version. In a real app, we'd aggregate stats from multiple tables.
     */
    static async checkAchievements(userId: string) {
        // Fetch User Stats
        // For MVP, we'll just check what we can easily query

        // Count completed lessons (using TaskProgress as proxy for lessons/tasks)
        const tasksCompleted = await prisma.taskProgress.count({
            where: { userId, completed: true }
        });

        const progress = await prisma.userProgress.findUnique({
            where: { userId_planVersion: { userId, planVersion: "v1" } }
        });

        const stats = {
            lessonsCompleted: tasksCompleted,
            streak: progress?.streakDays || 0,
            xp: progress?.currentXp || 0
        };

        const unlocked: string[] = [];

        // Check each rule
        for (const rule of ACHIEVEMENT_RULES) {
            if (rule.check(stats)) {
                // Check if already unlocked
                // Ideally we'd have a DB check, but for now let's assume we try to upsert
                // Or simplified: Just unlock it.

                // We need actual Achievement records in DB to map "first-lesson" to an ID.
                // Since we didn't seed them, we might skip DB insertion if they don't exist.
                // For this MVP, we will try to find the Achievement by *title* or *type*.
                // Let's assume we look up by 'type' (which we defined as string in schema).

                const achievement = await prisma.achievement.findFirst({
                    where: { type: rule.id }
                });

                if (achievement) {
                    try {
                        await prisma.userAchievement.create({
                            data: {
                                userId,
                                achievementId: achievement.id,
                                unlocked: true,
                                unlockedAt: new Date()
                            }
                        });
                        unlocked.push(achievement.title);
                    } catch (e) {
                        // Ignore duplicate key error (already unlocked)
                    }
                }
            }
        }

        return unlocked;
    }
}
