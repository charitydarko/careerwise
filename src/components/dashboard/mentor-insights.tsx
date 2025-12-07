"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Info, AlertTriangle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Insight = {
    id: string;
    type: "recommendation" | "warning" | "encouragement";
    content: string;
    isRead: boolean;
};

export function MentorInsights() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchInsights() {
        try {
            // For now, usage "latest" endpoint until we have a proper list endpoint. 
            // Or just assume single insight for MVP dashboard.
            const response = await fetch("/api/mentor/insights/latest");
            if (response.ok) {
                const data = await response.json();
                if (data.insight) {
                    setInsights([data.insight]);
                } else {
                    setInsights([]);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetch("/api/mentor/analyze", { method: "POST" });
            // Wait a bit for DB to update?
            await new Promise(r => setTimeout(r, 2000));
            await fetchInsights();
        } catch (e) {
            console.error("Refresh failed", e);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    if (loading) return null;
    if (insights.length === 0 && !refreshing) return null;

    return (
        <div className="flex flex-col gap-3">
            {insights.map(insight => (
                <Card key={insight.id} className="p-4 border-l-4 border-l-[#00BFA6] bg-[#ecfdf9]">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-[#007864] mt-0.5" />
                        <div className="text-sm text-[#007864] flex-1">
                            <span className="font-semibold block mb-1">Mentor Tip</span>
                            {insight.content}
                        </div>
                    </div>
                </Card>
            ))}
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="text-xs text-slate-400 hover:text-[#1F3C88]"
                >
                    <RefreshCw className={`mr-2 h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? "Analyzing..." : "Refresh Analysis"}
                </Button>
            </div>
        </div>
    );
}
