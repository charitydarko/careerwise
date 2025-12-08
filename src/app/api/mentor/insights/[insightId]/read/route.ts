
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/mentor/insights/[insightId]/read
 * Mark an insight as read
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ insightId: string }> }
) {
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
        const { insightId } = await params;

        // Verify ownership
        const insight = await prisma.mentorInsight.findUnique({
            where: { id: insightId },
        });

        if (!insight) {
            return NextResponse.json({ error: "Insight not found" }, { status: 404 });
        }

        if (insight.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Update
        const updated = await prisma.mentorInsight.update({
            where: { id: insightId },
            data: { isRead: true },
        });

        return NextResponse.json({ success: true, insight: updated });
    } catch (error) {
        console.error("Error marking insight as read:", error);
        return NextResponse.json(
            { error: "Failed to update insight" },
            { status: 500 }
        );
    }
}
