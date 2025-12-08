import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCourseTasks } from "@/lib/task-generator";

type Body = {
  trackId?: string;
  trackName?: string;
  numTasksPerCourse?: number;
  targetRole?: string;
  primaryStack?: string;
  hoursPerWeek?: number;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionUser = session.user as any;
  const sessionUserId = sessionUser?.id ?? sessionUser?.sub ?? null;

  try {
    const body = (await request.json()) as Body;
    const numTasksPerCourse = Math.max(3, Math.min(body.numTasksPerCourse ?? 3, 8));

    const user =
      (sessionUserId &&
        (await prisma.user.findUnique({
          where: { id: sessionUserId },
          include: { profile: true },
        }))) ||
      (sessionUser?.email
        ? await prisma.user.findUnique({
            where: { email: sessionUser.email },
            include: { profile: true },
          })
        : null);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find track by id or by name (matching profile's careerTrack)
    const track =
      (body.trackId &&
        (await prisma.track.findUnique({
          where: { id: body.trackId },
          include: { courses: true },
        }))) ||
      (await prisma.track.findFirst({
        where: {
          name: body.trackName ?? user.profile?.careerTrack ?? undefined,
        },
        include: { courses: true },
      }));

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const targetRole =
      body.targetRole ||
      user.profile?.careerTrack ||
      body.trackName ||
      track.name ||
      "Engineer";

    const courses = track.courses.map((course) =>
      generateCourseTasks(course, numTasksPerCourse, {
        user,
        targetRole,
        hoursPerWeek: body.hoursPerWeek,
      }),
    );

    return NextResponse.json({
      user_id: user.id,
      track: track.name,
      level: user.profile?.learningLevel ?? "beginner",
      target_role: targetRole,
      courses,
    });
  } catch (error) {
    console.error("[GENERATE_TASKS_POST]", error);
    return NextResponse.json(
      { error: "Failed to generate tasks" },
      { status: 500 },
    );
  }
}
