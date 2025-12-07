
"use client";

import { useEffect, useState } from "react";
import { Award, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";

type Achievement = {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    unlockedAt: string | null;
    icon: string | null;
};

// We'll fetch from an API, but for now we can reuse the dashboard data logic or create a dedicated endpoint.
// Let's create a dedicated endpoint: /api/achievements/all

export default function BadgesPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBadges() {
            try {
                // We'll create this endpoint next
                const res = await fetch("/api/achievements");
                if (res.ok) {
                    const data = await res.json();
                    setAchievements(data.achievements);
                }
            } catch (e) {
                console.error("Failed to fetch badges", e);
            } finally {
                setLoading(false);
            }
        }
        fetchBadges();
    }, []);

    return (
        <main className="min-h-screen bg-[#f3f6ff] pb-16 pt-12 font-[family:var(--font-inter)]">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 lg:px-10">

                {/* Header */}
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1F3C88] mb-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-semibold text-[#1F3C88]">Your Badges</h1>
                        <p className="text-base text-slate-600">Showcase of your milestones and achievements.</p>
                    </div>
                </header>

                <FadeInSection className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse"></div>)
                    ) : (
                        achievements.map((badge) => (
                            <div
                                key={badge.id}
                                className={cn(
                                    "flex flex-col items-center justify-center p-8 rounded-3xl border text-center transition-all",
                                    badge.unlocked
                                        ? "bg-white border-white/80 shadow-sm hover:shadow-md"
                                        : "bg-slate-50 border-slate-100 opacity-75"
                                )}
                            >
                                <div className={cn(
                                    "mb-4 flex items-center justify-center w-20 h-20 rounded-full",
                                    badge.unlocked ? "bg-orange-100 text-orange-500" : "bg-slate-200 text-slate-400"
                                )}>
                                    {badge.unlocked ? <Award className="w-10 h-10" /> : <Lock className="w-8 h-8" />}
                                </div>
                                <h3 className={cn("text-lg font-bold mb-2", badge.unlocked ? "text-[#1F3C88]" : "text-slate-500")}>
                                    {badge.title}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">{badge.description}</p>
                                {badge.unlocked ? (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-100">
                                        Unlocked
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-slate-400 border-slate-300">
                                        Locked
                                    </Badge>
                                )}
                            </div>
                        ))
                    )}
                </FadeInSection>

            </div>
        </main>
    );
}
