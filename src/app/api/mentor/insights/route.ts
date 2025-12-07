
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;

        const insights = await prisma.mentorInsight.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ insights });
    } catch (error) {
        console.error("Error fetching insights:", error);
        return NextResponse.json(
            { error: "Failed to fetch insights" },
            { status: 500 }
        );
    }
}

