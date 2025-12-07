
import { auth } from "@/lib/auth";
import { analyzeUserProfile } from "@/lib/analysis-service";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;

        // Trigger analysis immediately
        await analyzeUserProfile(userId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Manual analysis failed:", error);
        return NextResponse.json(
            { error: "Analysis failed" },
            { status: 500 }
        );
    }
}
