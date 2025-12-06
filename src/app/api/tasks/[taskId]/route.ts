import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkAndUnlockAchievements } from "@/lib/achievement-service";

/**
 * PUT /api/tasks/[taskId]
 * Mark a task as complete or incomplete
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const { taskId } = await params;
    const body = await request.json();
    const { completed } = body;

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "completed field is required and must be a boolean" },
        { status: 400 }
      );
    }

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Upsert task progress
    const taskProgress = await prisma.taskProgress.upsert({
      where: {
        userId_taskId: {
          userId,
          taskId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        taskId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // If marking as complete, check if all tasks for today are done
    if (completed) {
      // Get user's profile and progress
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

      if (user?.profile && user.progress[0]) {
        const currentDay = user.progress[0].currentDay;
        const careerTrack = user.profile.careerTrack;

        // Get all tasks for today
        const todayTasks = await prisma.task.findMany({
          where: {
            careerTrack,
            day: currentDay,
          },
          include: {
            progress: {
              where: { userId },
            },
          },
        });

        // Check if all tasks are completed
        const allCompleted = todayTasks.every(
          (t) => t.progress[0]?.completed || false
        );

        if (allCompleted) {
          // Update user progress: move to next day
          const totalTasks = await prisma.task.count({
            where: { careerTrack },
          });

          const completedTasks = await prisma.taskProgress.count({
            where: {
              userId,
              completed: true,
            },
          });

          const progressPercent = Math.round(
            (completedTasks / totalTasks) * 100
          );

          await prisma.userProgress.update({
            where: {
              userId_planVersion: {
                userId,
                planVersion: "v1",
              },
            },
            data: {
              currentDay: Math.min(currentDay + 1, 14),
              progressPercent,
              lastActiveDate: new Date(),
            },
          });
          
          // Check and unlock achievements after completing a day
          await checkAndUnlockAchievements(userId);
        }
      }
    } else {
      // Check achievements even when marking incomplete (in case progress changes)
      await checkAndUnlockAchievements(userId);
    }

    return NextResponse.json({ taskProgress });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
