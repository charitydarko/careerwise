import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateStreak } from "@/lib/achievement-service";
import { checkAndAdvanceDay } from "@/lib/day-progression-service";

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

    // Check and advance day if needed (before updating streak)
    const dayAdvancement = await checkAndAdvanceDay(userId);

    // Update streak when user accesses dashboard
    await updateStreak(userId);

    // Fetch user with profile and progress
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        progress: {
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentProgress = user.progress[0];

    // Return structured data for dashboard
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
      },
      profile: user.profile,
      progress: currentProgress || {
        currentDay: 1,
        totalDays: 14,
        currentPhase: "fundamentals",
        streakDays: 0,
        progressPercent: 0,
      },
      dayAdvancement: dayAdvancement.advanced ? {
        advanced: true,
        newDay: dayAdvancement.newDay,
        message: dayAdvancement.message
      } : null
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const body = await request.json();
    const { currentDay, streakDays, progressPercent } = body;

    const progress = await prisma.userProgress.update({
      where: {
        userId_planVersion: {
          userId,
          planVersion: "v1",
        },
      },
      data: {
        currentDay,
        streakDays,
        progressPercent,
        lastActiveDate: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
