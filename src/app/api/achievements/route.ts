import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/achievements
 * Fetch all achievements with user's unlock status
 */
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;

    // Fetch all achievements
    const achievements = await prisma.achievement.findMany({
      include: {
        userAchievements: {
          where: {
            userId,
          },
        },
      },
    });

    // Format achievements with unlock status
    const formattedAchievements = achievements.map((achievement) => {
      const userAchievement = achievement.userAchievements[0];
      return {
        id: achievement.id,
        type: achievement.type,
        title: achievement.title,
        subtitle: achievement.subtitle,
        description: achievement.description,
        icon: achievement.icon,
        unlocked: userAchievement?.unlocked || false,
        unlockedAt: userAchievement?.unlockedAt,
        progress: userAchievement?.progress || 0,
      };
    });

    return NextResponse.json({ achievements: formattedAchievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
