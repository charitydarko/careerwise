
import { prisma } from "@/lib/prisma";

export type LeaderboardEntry = {
    rank: number;
    name: string;
    xp: number;
    level: number;
    isUser: boolean;
    avatar?: string;
};

const MOCK_USERS = [
    { name: "Sarah J.", xp: 2400, level: 25 },
    { name: "Michael C.", xp: 1850, level: 19 },
    { name: "David L.", xp: 1200, level: 13 },
    { name: "Jessica T.", xp: 950, level: 10 },
    { name: "Alex R.", xp: 600, level: 7 },
];

export class LeaderboardService {
    static async getWeeklyLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
        // 1. Fetch Real User Data
        const userProgress = await prisma.userProgress.findFirst({
            where: { userId, planVersion: "v1" },
            include: { user: true }
        });

        if (!userProgress) {
            return [];
        }

        const userEntry: LeaderboardEntry = {
            rank: 0, // Placeholder
            name: userProgress.user.name || "You",
            xp: userProgress.currentXp,
            level: userProgress.level,
            isUser: true
        };

        // 2. Generate Mock Data (Deterministic but varied enough)
        // We'll just use the static list for MVP, maybe jitter the XP slightly?
        const entries: LeaderboardEntry[] = MOCK_USERS.map((u, i) => ({
            rank: 0,
            name: u.name,
            xp: u.xp,
            level: u.level,
            isUser: false
        }));

        // 3. Merge & Sort
        const allEntries = [...entries, userEntry].sort((a, b) => b.xp - a.xp);

        // 4. Assign Ranks
        return allEntries.map((e, index) => ({
            ...e,
            rank: index + 1
        }));
    }
}
