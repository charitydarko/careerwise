import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/super-admin";

/**
 * GET /api/admin/tracks/:trackId - fetch a single track with courses
 * PUT /api/admin/tracks/:trackId - update track info and upsert courses
 */
export async function GET(
  _request: Request,
  { params }: { params: { trackId: string } },
) {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const track = await prisma.track.findUnique({
      where: { id: params.trackId },
      include: {
        courses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    return NextResponse.json({ track });
  } catch (error) {
    console.error("[ADMIN_TRACK_GET]", error);
    return NextResponse.json(
      { error: "Failed to load track" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { trackId: string } },
) {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, description, courses } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    const track = await prisma.track.update({
      where: { id: params.trackId },
      data: {
        ...updates,
        courses: courses?.length
          ? {
              upsert: courses.map((course: any) => ({
                where: { id: course.id ?? "" },
                create: {
                  name: course.name,
                  description: course.description || null,
                  modules: course.modules ?? null,
                },
                update: {
                  name: course.name,
                  description: course.description || null,
                  modules: course.modules ?? null,
                },
              })),
            }
          : undefined,
      },
      include: { courses: true },
    });

    return NextResponse.json({ track });
  } catch (error) {
    console.error("[ADMIN_TRACK_PUT]", error);
    return NextResponse.json(
      { error: "Failed to update track" },
      { status: 500 },
    );
  }
}
