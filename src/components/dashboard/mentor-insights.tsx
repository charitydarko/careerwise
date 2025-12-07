
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Trophy, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
    id: string;
    type: "recommendation" | "encouragement" | "warning";
    content: string;
}

export function MentorInsights() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be a server action or API call
        // For now, we'll mock the fetch or implement a simple API later
        // defaulting to empty to avoid breaking build before API is ready
        setLoading(false);
    }, []);

    if (loading || insights.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {insights.map((insight) => (
                <Card
                    key={insight.id}
                    className={cn(
                        "border-l-4",
                        insight.type === "recommendation" && "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/20",
                        insight.type === "encouragement" && "border-l-green-500 bg-green-50/50 dark:bg-green-900/20",
                        insight.type === "warning" && "border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/20"
                    )}
                >
                    <CardContent className="p-4 flex gap-3 items-start">
                        <div className="mt-1">
                            {insight.type === "recommendation" && <Lightbulb className="w-5 h-5 text-blue-500" />}
                            {insight.type === "encouragement" && <Trophy className="w-5 h-5 text-green-500" />}
                            {insight.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium leading-relaxed">
                                {insight.content}
                            </p>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
