
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { LeaderboardService } from "@/lib/leaderboard-service";

export async function GET() {
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
        const leaderboard = await LeaderboardService.getWeeklyLeaderboard(userId);

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
