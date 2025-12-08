import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/super-admin";

/**
 * POST /api/admin/courses - create a course under a track
 */
export async function POST(request: Request) {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { trackId, name, description, modules } = body;

    if (!trackId || !name?.trim()) {
      return NextResponse.json(
        { error: "trackId and name are required" },
        { status: 400 },
      );
    }

    const course = await prisma.course.create({
      data: {
        trackId,
        name: name.trim(),
        description: description || null,
        modules: modules ?? null,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_COURSES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
