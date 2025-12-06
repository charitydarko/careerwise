import { prisma } from "./prisma";

type AchievementRequirement = {
  type: "days_completed" | "streak_days" | "tasks_completed" | "projects_completed";
  count: number;
};

/**
 * Check and unlock achievements for a user based on their progress
 */
export async function checkAndUnlockAchievements(userId: string) {
  try {
    // Get user's current stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          where: { planVersion: "v1" },
          take: 1,
        },
      },
    });

    if (!user || !user.progress[0]) {
      return;
    }

    const progress = user.progress[0];

    // Count completed tasks
    const completedTasksCount = await prisma.taskProgress.count({
      where: {
        userId,
        completed: true,
      },
    });

    // Calculate days completed (tasks completed / tasks per day)
    const daysCompleted = Math.floor(progress.currentDay - 1);

    // Get all achievements
    const achievements = await prisma.achievement.findMany();

    // Check each achievement
    for (const achievement of achievements) {
      try {
        const requirement: AchievementRequirement = JSON.parse(
          achievement.requirement
        );

        let shouldUnlock = false;
        let progressValue = 0;

        // Check if requirement is met
        switch (requirement.type) {
          case "days_completed":
            progressValue = Math.min((daysCompleted / requirement.count) * 100, 100);
            shouldUnlock = daysCompleted >= requirement.count;
            break;

          case "streak_days":
            progressValue = Math.min((progress.streakDays / requirement.count) * 100, 100);
            shouldUnlock = progress.streakDays >= requirement.count;
            break;

          case "tasks_completed":
            progressValue = Math.min((completedTasksCount / requirement.count) * 100, 100);
            shouldUnlock = completedTasksCount >= requirement.count;
            break;

          case "projects_completed":
            // Projects not yet implemented, so always 0
            progressValue = 0;
            shouldUnlock = false;
            break;
        }

        // Upsert user achievement
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
          update: {
            unlocked: shouldUnlock,
            unlockedAt: shouldUnlock ? new Date() : undefined,
            progress: Math.round(progressValue),
          },
          create: {
            userId,
            achievementId: achievement.id,
            unlocked: shouldUnlock,
            unlockedAt: shouldUnlock ? new Date() : undefined,
            progress: Math.round(progressValue),
          },
        });

        if (shouldUnlock) {
          console.log(`[Achievements] Unlocked: ${achievement.title} for user ${userId}`);
        }
      } catch (parseError) {
        console.error(
          `[Achievements] Failed to parse requirement for ${achievement.id}:`,
          parseError
        );
      }
    }
  } catch (error) {
    console.error("[Achievements] Error checking achievements:", error);
  }
}

/**
 * Update streak and check achievements
 * Call this when user logs in or completes daily tasks
 */
export async function updateStreak(userId: string) {
  try {
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_planVersion: {
          userId,
          planVersion: "v1",
        },
      },
    });

    if (!progress) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(progress.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = progress.streakDays;

    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      newStreak = progress.streakDays + 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    // Update progress
    await prisma.userProgress.update({
      where: {
        userId_planVersion: {
          userId,
          planVersion: "v1",
        },
      },
      data: {
        streakDays: newStreak,
        lastActiveDate: new Date(),
      },
    });

    // Check achievements after updating streak
    await checkAndUnlockAchievements(userId);
  } catch (error) {
    console.error("[Achievements] Error updating streak:", error);
  }
}
