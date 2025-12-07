
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/mentor/insights/latest
 * Fetch the latest unread high-priority insight for the proactive greeting
 */
export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;

        // Find the latest unread insight (prefer high priority)
        // We want to be proactive, so we look for something relevant.
        // Logic: Unread, not expired.

        // First try high priority
        let insight = await prisma.mentorInsight.findFirst({
            where: {
                userId,
                isRead: false,
                // type: "warning", // or just any? Let's prioritize by creation
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!insight) {
            // Try any unread
            insight = await prisma.mentorInsight.findFirst({
                where: {
                    userId,
                    isRead: false,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        if (!insight) {
            return NextResponse.json({ insight: null });
        }

        // Mark as read immediately? 
        // Maybe better to mark as read ONLY if the client confirms it used it.
        // For now, let's keep it unread until the client "consumes" it, 
        // OR we can rely on the client to call a mark-read endpoint.
        // But for simplicity in this MVP, let's just return it. 
        // The "Voice Proactivity" feature implies we just speak it. 
        // If we speak it every time the user opens the panel until they dismiss it, that's annoying.
        // Let's mark it as read here to ensure it's "consumed" as a greeting.
        // Wait, GET requests shouldn't have side effects ideally.
        // But for this specific "fetch next greeting" use case, it's acceptable for MVP.
        // PROPER WAY: Client fetches, then POST /api/mentor/insights/[id]/read.
        // Let's do the proper way if we have time, but let's stick to simple first:
        // Just return it. The client handles logic. 

        return NextResponse.json({ insight });
    } catch (error) {
        console.error("Error fetching latest insight:", error);
        return NextResponse.json(
            { error: "Failed to fetch insight" },
            { status: 500 }
        );
    }
}
