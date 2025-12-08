import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/super-admin";

/**
 * PUT /api/admin/courses/:courseId - update a single course
 */
export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } },
) {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, description, modules } = body;

    const course = await prisma.course.update({
      where: { id: params.courseId },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        modules: modules ?? undefined,
      },
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error("[ADMIN_COURSE_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}
