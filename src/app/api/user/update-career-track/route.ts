"use server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { careerTrack } = await request.json();

    if (!careerTrack) {
      return NextResponse.json(
        { error: "Career track is required" },
        { status: 400 }
      );
    }

    // Validate career track
    const validTracks = ["frontend", "data", "cloud", "ux", "backend"];
    if (!validTracks.includes(careerTrack.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid career track" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true, progress: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update or create career profile
    const updatedProfile = await prisma.careerProfile.upsert({
      where: { userId: user.id },
      update: { careerTrack: careerTrack.toLowerCase() },
      create: {
        userId: user.id,
        careerTrack: careerTrack.toLowerCase(),
        learningLevel: "beginner",
        onboardingComplete: false,
      },
    });

    // Reset progress to day 1 when changing career track
    await prisma.userProgress.updateMany({
      where: { userId: user.id },
      data: {
        currentDay: 1,
        progressPercent: 0,
        currentPhase: "fundamentals",
      },
    });

    // Delete all task progress to allow fresh start
    await prisma.taskProgress.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Career track updated successfully. Progress has been reset to Day 1.",
    });
  } catch (error) {
    console.error("Update career track error:", error);
    return NextResponse.json(
      { error: "Failed to update career track" },
      { status: 500 }
    );
  }
}
