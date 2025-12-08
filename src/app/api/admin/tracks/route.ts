import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/super-admin";

/**
 * GET /api/admin/tracks - list all tracks with courses
 * POST /api/admin/tracks - create a new track (and optional starter courses)
 */
export async function GET() {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const tracks = await prisma.track.findMany({
      include: {
        courses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("[ADMIN_TRACKS_GET]", error);
    return NextResponse.json(
      { error: "Failed to load tracks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, description, courses } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Track name is required" },
        { status: 400 },
      );
    }

    const track = await prisma.track.create({
      data: {
        name: name.trim(),
        description: description || null,
        courses: courses?.length
          ? {
              create: courses.map((course: any) => ({
                name: course.name,
                description: course.description || null,
                modules: course.modules ?? null,
              })),
            }
          : undefined,
      },
      include: { courses: true },
    });

    return NextResponse.json({ track }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_TRACKS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create track" },
      { status: 500 },
    );
  }
}
