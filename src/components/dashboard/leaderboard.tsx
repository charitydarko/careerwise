
"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LeaderboardEntry = {
    rank: number;
    name: string;
    xp: number;
    level: number;
    isUser: boolean;
};

export function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch("/api/leaderboard");
                if (res.ok) {
                    const data = await res.json();
                    setEntries(data.leaderboard);
                }
            } catch (e) {
                console.error("Failed to fetch leaderboard", e);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-slate-100 rounded-2xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.length === 0 ? (
                <div className="text-center p-4 text-slate-500 text-sm">
                    No active users this week.
                </div>
            ) : (
                entries.map((entry) => (
                    <div
                        key={entry.rank}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-2xl border transition-all",
                            entry.isUser
                                ? "bg-[#ecfdf9] border-[#00BFA6]/30 shadow-sm transform scale-[1.02]"
                                : "bg-white border-slate-100"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                                entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                                    entry.rank === 2 ? "bg-slate-100 text-slate-600" :
                                        entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                                            "bg-white text-slate-400 border border-slate-100"
                            )}>
                                {entry.rank <= 3 ? <Trophy className="w-4 h-4" /> : entry.rank}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={cn("text-sm font-semibold truncate", entry.isUser ? "text-[#007864]" : "text-[#1F3C88]")}>
                                    {entry.name} {entry.isUser && "(You)"}
                                </p>
                                <p className="text-xs text-slate-400">Level {entry.level}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-bold text-[#1F3C88]">{entry.xp.toLocaleString()} XP</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
