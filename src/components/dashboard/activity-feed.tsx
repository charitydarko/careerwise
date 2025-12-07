
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Award, ArrowUpCircle, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActivityType = "task" | "levelup" | "achievement" | "streak";

type ActivityEvent = {
    id: string;
    user: string;
    type: ActivityType;
    message: string;
    time: string;
};

const MOCK_ACTIVITY: ActivityEvent[] = [
    { id: "1", user: "Michael C.", type: "levelup", message: "reached Level 19", time: "2m ago" },
    { id: "2", user: "Sarah J.", type: "task", message: "completed 'Deep Work Session'", time: "15m ago" },
    { id: "3", user: "David L.", type: "streak", message: "hit a 7-day streak!", time: "1h ago" },
    { id: "4", user: "Jessica T.", type: "achievement", message: "unlocked 'Networker'", time: "2h ago" },
];

const typeMeta = {
    task: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    levelup: { icon: ArrowUpCircle, color: "text-purple-500", bg: "bg-purple-50" },
    achievement: { icon: Award, color: "text-orange-500", bg: "bg-orange-50" },
    streak: { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
};

export function ActivityFeed() {
    // In a real app, this would fetch from an API or websocket
    const [events, setEvents] = useState<ActivityEvent[]>(MOCK_ACTIVITY);

    return (
        <div className="space-y-4">
            {events.map((event) => {
                const meta = typeMeta[event.type];
                const Icon = meta.icon;
                return (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:shadow-sm transition-shadow">
                        <div className={cn("p-2 rounded-full", meta.bg, meta.color)}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-700">
                                <span className="font-semibold text-[#1F3C88]">{event.user}</span> {event.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{event.time}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
