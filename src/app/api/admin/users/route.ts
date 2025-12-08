import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/super-admin";

/**
 * GET /api/admin/users
 * List all users for super admin view
 */
export async function GET() {
  const { errorResponse } = await requireSuperAdmin();
  if (errorResponse) return errorResponse;

  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isSuperAdmin: user.isSuperAdmin,
        careerTrack: user.profile?.careerTrack ?? null,
      })),
    });
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 },
    );
  }
}
