import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/tracks
 * List tracks and courses for authenticated users (used in settings track selector).
 */
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tracks = await prisma.track.findMany({
      include: { courses: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("[TRACKS_GET]", error);
    return NextResponse.json({ error: "Failed to load tracks" }, { status: 500 });
  }
}
