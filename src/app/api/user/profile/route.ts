import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return NextResponse.json({ profile: user?.profile, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { careerTrack, timeCommitment, preferredLearning, goal } = body;

    const userId =
      (session.user as any).id || (session.user as any).sub || null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert career profile
    const profile = await prisma.careerProfile.upsert({
      where: {
        userId,
      },
      update: {
        careerTrack,
        timeCommitment,
        preferredLearning,
        onboardingComplete: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        careerTrack,
        timeCommitment,
        preferredLearning,
        onboardingComplete: true,
      },
    });

    // Create initial user progress
    await prisma.userProgress.upsert({
      where: {
        userId_planVersion: {
          userId,
          planVersion: "v1",
        },
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        userId,
        planVersion: "v1",
        currentDay: 1,
        totalDays: 14,
        currentPhase: "fundamentals",
        streakDays: 0,
        progressPercent: 0,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
