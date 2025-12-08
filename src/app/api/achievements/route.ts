
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId =
      (session.user as any).id || (session.user as any).sub || null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get all Defined Achievements
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { title: "asc" }
    });

    // 2. Get User's Unlocked Achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId }
    });

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

    // 3. Map to Response Format
    const achievements = allAchievements.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      unlocked: unlockedIds.has(a.id),
      unlockedAt: userAchievements.find(ua => ua.achievementId === a.id)?.unlockedAt || null
    }));

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
