import Link from "next/link";
import { BookOpen, ArrowLeft, Timer } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { LessonGeneratorClient } from "../lesson-client";
import type { LearningLevel } from "@/types/ai";

type LearnPageProps = {
  params: { taskId: string };
};

export default async function LearnPage({ params }: LearnPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const taskId = params?.taskId;

  const userId = (session.user as any).id;

  const [task, profile] = await Promise.all([
    taskId ? prisma.task.findUnique({ where: { id: taskId } }) : null,
    prisma.careerProfile.findUnique({ where: { userId } }),
  ]);

  const invalidTask = !taskId || !task;
  const trackMismatch =
    !!task && !!profile && profile.careerTrack !== task.careerTrack;

  if (invalidTask || trackMismatch) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
          {trackMismatch ? "Track mismatch" : "Task not found"}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">We couldn’t open that lesson</h1>
        <p className="text-sm text-muted-foreground">
          {trackMismatch
            ? "This task belongs to a different career track than your profile."
            : "The task ID looks invalid or the task no longer exists. Head back to your dashboard and open a task again."}
        </p>
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const learningLevel = mapDifficultyToLevel(task.difficulty, profile?.learningLevel);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            In-platform lesson
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{task.title}</h1>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1">
              Track: {task.careerTrack}
            </span>
            <span className="rounded-full bg-muted px-3 py-1">
              Day {task.day}
            </span>
            <span className="rounded-full bg-muted px-3 py-1">
              Difficulty: {task.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
              <Timer className="h-4 w-4" />
              {task.estimatedMinutes} mins
            </span>
          </div>
        </div>
        {task.resourceUrl && (
          <Card className="hidden max-w-sm space-y-2 p-4 sm:block">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Original resource
            </div>
            <a
              href={task.resourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {task.resourceUrl}
            </a>
            <p className="text-xs text-muted-foreground">
              Keep this open if you want to compare with the on-platform lesson.
            </p>
          </Card>
        )}
      </div>

      <LessonGeneratorClient
        topic={task.title}
        difficulty={learningLevel}
        careerTrack={task.careerTrack}
        estimatedMinutes={task.estimatedMinutes}
        resourceUrl={task.resourceUrl ?? undefined}
      />
    </div>
  );
}

function mapDifficultyToLevel(
  difficulty: string,
  fallback?: string | null,
): LearningLevel {
  const normalized = difficulty.toLowerCase();

  if (normalized === "starter") return "beginner";
  if (normalized === "focus") return "intermediate";
  if (normalized === "deep") return "advanced";

  if (fallback === "intermediate" || fallback === "advanced" || fallback === "beginner") {
    return fallback;
  }

  return "beginner";
}
