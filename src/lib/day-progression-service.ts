import { prisma } from "@/lib/prisma";

/**
 * Check if user should advance to the next day based on last active date
 * Automatically updates currentDay and progressPercent if needed
 */
export async function checkAndAdvanceDay(userId: string): Promise<{
    advanced: boolean;
    newDay?: number;
    message?: string;
}> {
    try {
        const progress = await prisma.userProgress.findFirst({
            where: { userId, planVersion: "v1" }
        });

        if (!progress) {
            return { advanced: false, message: "No progress record found" };
        }

        const now = new Date();
        const lastActive = new Date(progress.lastActiveDate);
        const hoursSinceLastActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

        // If less than 24 hours, no advancement needed
        if (hoursSinceLastActive < 24) {
            return { advanced: false, message: "Less than 24 hours since last activity" };
        }

        // Calculate how many days should advance (in case user was away for multiple days)
        const daysToAdvance = Math.floor(hoursSinceLastActive / 24);
        const newDay = Math.min(progress.currentDay + daysToAdvance, progress.totalDays);

        // Don't advance if already at the last day
        if (newDay === progress.currentDay) {
            return { advanced: false, message: "Already at final day" };
        }

        // Calculate new progress percentage
        const newProgressPercent = Math.round((newDay / progress.totalDays) * 100);

        // Update progress
        await prisma.userProgress.update({
            where: {
                userId_planVersion: {
                    userId,
                    planVersion: "v1"
                }
            },
            data: {
                currentDay: newDay,
                progressPercent: newProgressPercent,
                lastActiveDate: now,
                updatedAt: now
            }
        });

        console.log(`[Day Progression] User ${userId} advanced from Day ${progress.currentDay} to Day ${newDay}`);

        return {
            advanced: true,
            newDay,
            message: `Advanced to Day ${newDay}`
        };
    } catch (error) {
        console.error("[Day Progression] Error:", error);
        return { advanced: false, message: "Error checking day progression" };
    }
}

/**
 * Update last active date without advancing day
 * Used when user is active but shouldn't advance yet
 */
export async function updateLastActive(userId: string): Promise<void> {
    try {
        await prisma.userProgress.updateMany({
            where: { userId, planVersion: "v1" },
            data: {
                lastActiveDate: new Date(),
                updatedAt: new Date()
            }
        });
    } catch (error) {
        console.error("[Day Progression] Error updating last active:", error);
    }
}
