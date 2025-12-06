import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/tasks
 * Fetch tasks for the authenticated user based on their career track and current day
 */
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;

    // Get user profile and progress
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        progress: {
          where: { planVersion: "v1" },
          take: 1,
        },
      },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const careerTrack = user.profile.careerTrack;
    const currentDay = user.progress[0]?.currentDay || 1;

    // Fetch tasks for this career track and current day
    const tasks = await prisma.task.findMany({
      where: {
        careerTrack,
        day: currentDay,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        progress: {
          where: {
            userId,
          },
        },
      },
    });

    // Format tasks with completion status
    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      estimatedMinutes: task.estimatedMinutes,
      resourceUrl: task.resourceUrl,
      completed: task.progress[0]?.completed || false,
      completedAt: task.progress[0]?.completedAt,
    }));

    return NextResponse.json({
      tasks: formattedTasks,
      currentDay,
      careerTrack,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
