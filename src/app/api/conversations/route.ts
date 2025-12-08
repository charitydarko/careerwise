import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/conversations
 * Fetch conversation history for the authenticated user
 */
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId =
      (session.user as any).id || (session.user as any).sub || null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    // Fetch recent conversations
    const conversations = await prisma.conversation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Return in chronological order (oldest first)
    const messages = conversations.reverse().map((conv) => ({
      id: conv.id,
      role: conv.role,
      content: conv.content,
      timestamp: conv.createdAt,
      context: conv.context,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
