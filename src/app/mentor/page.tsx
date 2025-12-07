
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Lightbulb, Info, AlertTriangle, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeInSection } from "@/components/fade-in-section";
import { cn } from "@/lib/utils";

type Insight = {
    id: string;
    type: "recommendation" | "warning" | "encouragement";
    content: string;
    isRead: boolean;
    createdAt: string;
    expiresAt: string | null;
};

const typeMeta = {
    recommendation: { icon: Lightbulb, color: "text-[#00BFA6]", bg: "bg-[#ecfdf9]", border: "border-[#00BFA6]/30", label: "Tip" },
    warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", label: "Focus" },
    encouragement: { icon: Info, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", label: "Note" },
};

export default function MentorHubPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        async function fetchInsights() {
            try {
                const res = await fetch("/api/mentor/insights");
                if (res.ok) {
                    const data = await res.json();
                    setInsights(data.insights);
                }
            } catch (e) {
                console.error("Failed to fetch insights", e);
            } finally {
                setLoading(false);
            }
        }
        fetchInsights();
    }, []);

    const filteredInsights = insights.filter(i => filter === "all" || i.type === filter);

    return (
        <main className="min-h-screen bg-[#f3f6ff] pb-16 pt-12 font-[family:var(--font-inter)]">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 lg:px-10">

                {/* Header */}
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1F3C88] mb-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-semibold text-[#1F3C88]">Mentor Hub</h1>
                        <p className="text-base text-slate-600">Your personal archive of AI-driven advice and analysis.</p>
                    </div>
                </header>

                {/* Filters */}
                <div className="flex gap-2 pb-2 overflow-x-auto">
                    {["all", "recommendation", "warning", "encouragement"].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "rounded-full capitalize",
                                filter === f ? "bg-[#1F3C88] text-white" : "bg-white text-slate-600 border-slate-200"
                            )}
                        >
                            {f === "all" ? "All Insights" : f}
                        </Button>
                    ))}
                </div>

                {/* Content */}
                <FadeInSection className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1F3C88] border-t-transparent mx-auto"></div>
                            <p className="mt-4 text-sm text-slate-600">Loading insights...</p>
                        </div>
                    ) : filteredInsights.length === 0 ? (
                        <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No insights found for this filter.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredInsights.map((insight) => {
                                const meta = typeMeta[insight.type] || typeMeta.recommendation;
                                const Icon = meta.icon;
                                return (
                                    <div key={insight.id} className={cn("group relative flex flex-col gap-3 rounded-3xl border p-6 bg-white shadow-sm transition hover:shadow-md", meta.border)}>
                                        <div className="flex items-start justify-between">
                                            <Badge variant="outline" className={cn("capitalize border-0", meta.bg, meta.color)}>
                                                <Icon className="mr-1 h-3 w-3" />
                                                {meta.label}
                                            </Badge>
                                            <span className="text-xs text-slate-400">
                                                {format(new Date(insight.createdAt), "MMM d")}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 text-sm leading-relaxed">
                                            {insight.content}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </FadeInSection>

            </div>
        </main>
    );
}
