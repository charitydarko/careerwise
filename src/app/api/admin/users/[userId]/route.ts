import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/super-admin";

/**
 * GET /api/admin/users/:userId
 * Return user profile details, enrollments, and available tracks/courses
 */
export async function GET(
  _request: Request,
  { params }: { params: { userId: string } },
) {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  const userId = params.userId;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const [user, tracks] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          enrollments: {
            include: {
              track: true,
              course: true,
            },
          },
        },
      }),
      prisma.track.findMany({
        include: {
          courses: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isSuperAdmin: user.isSuperAdmin,
        profile: user.profile,
      },
      availableTracks: tracks,
      enrollments: user.enrollments.map((enrollment) => ({
        id: enrollment.id,
        enrollmentDate: enrollment.enrollmentDate,
        progress: enrollment.progress,
        track: enrollment.track
          ? {
              id: enrollment.track.id,
              name: enrollment.track.name,
            }
          : null,
        course: enrollment.course
          ? {
              id: enrollment.course.id,
              name: enrollment.course.name,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("[ADMIN_USER_DETAIL_GET]", error);
    return NextResponse.json(
      { error: "Failed to load user details" },
      { status: 500 },
    );
  }
}
