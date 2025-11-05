"use client";

import { useMemo } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  ArrowLeft,
  Award,
  Flame,
  Medal,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type TimelineEvent = {
  id: string;
  type: "check-in" | "streak" | "win";
  summary: string;
  detail: string;
  createdAt: string;
  delta?: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  tier: "bronze" | "silver" | "gold";
};

const timelineEvents: TimelineEvent[] = [
  {
    id: "event-1",
    type: "check-in",
    summary: "Shared daily update",
    detail: "Voice recap logged for Day 6 — noted new retention insight.",
    createdAt: "2024-11-05T08:30:00.000Z",
    delta: "+21 deep work mins",
  },
  {
    id: "event-2",
    type: "win",
    summary: "Milestone insight",
    detail: "Identified top quartile segment with 62% activation rate.",
    createdAt: "2024-11-04T17:00:00.000Z",
    delta: "Added to plan summary",
  },
  {
    id: "event-3",
    type: "streak",
    summary: "Streak extended",
    detail: "Completed daily sprint four days in a row.",
    createdAt: "2024-11-03T11:10:00.000Z",
    delta: "Streak ×4",
  },
  {
    id: "event-4",
    type: "check-in",
    summary: "Async mentor ping",
    detail: "Asked for feedback on narrative flow in chat mode.",
    createdAt: "2024-11-02T21:15:00.000Z",
  },
];

const achievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Consistency Streak",
    description: "Logged check-ins for 4 consecutive days.",
    unlockedAt: "2024-11-03T11:10:00.000Z",
    tier: "silver",
  },
  {
    id: "ach-2",
    title: "Insight Synthesizer",
    description: "Captured 3 actionable insights this sprint.",
    unlockedAt: null,
    tier: "gold",
  },
  {
    id: "ach-3",
    title: "Mentor Whisperer",
    description: "Shared 5 voice updates with your mentor.",
    unlockedAt: "2024-10-30T09:45:00.000Z",
    tier: "bronze",
  },
  {
    id: "ach-4",
    title: "Flow Guardian",
    description: "Completed all focus tasks in a single day.",
    unlockedAt: null,
    tier: "silver",
  },
];

const quotes = [
  {
    quote: "Momentum is built in focused minutes, not perfect circumstances.",
    author: "CareerWise Mentor",
  },
  {
    quote: "Every check-in is a vote for the professional you’re becoming.",
    author: "CareerWise Mentor",
  },
  {
    quote: "Great careers accelerate when learning and reflection stay in sync.",
    author: "CareerWise Mentor",
  },
];

export default function ProgressPage() {
  const todayIndex = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff =
      now.getTime() -
      startOfYear.getTime() +
      (startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % quotes.length;
  }, []);

  const todaysQuote = quotes[todayIndex];

  const streakCount = timelineEvents.filter(
    (event) => event.type === "streak",
  ).length;

  return (
    <main className="min-h-screen bg-[#f3f6ff] pb-16 pt-12 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 lg:px-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-3">
            <Button
              variant="ghost"
              asChild
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f1f5ff] px-4 py-2 text-sm font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </a>
            </Button>
            <h1 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
              Progress & Achievements
            </h1>
            <p className="text-base text-slate-600">
              Review your daily check-ins, streak momentum, and badges unlocked through the sprint.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-3xl bg-[#1F3C88] px-5 py-4 text-white shadow-lg shadow-[#1F3C88]/30">
            <Flame className="h-6 w-6 text-[#FFD166]" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Active streaks
              </p>
              <p className="text-lg font-semibold">{streakCount} milestones logged</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <FadeInSection className="flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#1F3C88]">
                  Timeline
                </h2>
                <p className="text-sm text-slate-500">
                  Automatic log of check-ins, insights, and streak unlocks.
                </p>
              </div>
              <Badge variant="outline" className="border-[#00BFA6]/30 text-[#00BFA6]">
                {timelineEvents.length} entries
              </Badge>
            </div>
            <ScrollArea
              className="pr-3"
              style={{ height: `${Math.min(timelineEvents.length, 4) * 168}px` }}
            >
              <div className="relative pl-6">
                <ul className="space-y-6">
                  {timelineEvents.map((event, index) => (
                    <li
                      key={event.id}
                      className="relative pl-7 pb-2"
                      style={{ minHeight: "148px" }}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-2 flex size-10 items-center justify-center rounded-full border-2 border-white shadow-lg",
                          event.type === "check-in"
                            ? "bg-[#ecfdf9] text-[#007864]"
                            : event.type === "streak"
                              ? "bg-[#e0f2fe] text-[#1F3C88]"
                              : "bg-[#fef3c7] text-[#b45309]",
                        )}
                      >
                        {event.type === "check-in" && (
                          <MessageSquare className="h-5 w-5" />
                        )}
                        {event.type === "streak" && (
                          <TrendingUp className="h-5 w-5" />
                        )}
                        {event.type === "win" && (
                          <Medal className="h-5 w-5" />
                        )}
                      </span>
                      {index !== timelineEvents.length - 1 && (
                        <span className="absolute left-[1.25rem] top-[3.75rem] bottom-[-1.5rem] w-px bg-gradient-to-b from-[#1F3C88]/20 to-transparent" />
                      )}
                      <Card className="flex h-full flex-col justify-between border border-slate-200/70 bg-white/90 p-5">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                              {format(parseISO(event.createdAt), "MMM d, h:mma")}
                            </p>
                            <h3 className="text-lg font-semibold text-[#1F3C88]">
                              {event.summary}
                            </h3>
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            {formatDistanceToNow(parseISO(event.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                          {event.detail}
                        </p>
                        {event.delta && (
                          <Badge className="mt-4 w-fit rounded-full bg-[#00BFA6] px-3 py-1 text-xs font-semibold text-white">
                            {event.delta}
                          </Badge>
                        )}
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </FadeInSection>

          <div className="space-y-6">
            <FadeInSection className="rounded-3xl border border-white/80 bg-[#1F3C88] p-6 text-white shadow-[0_18px_80px_rgba(31,60,136,0.25)] backdrop-blur lg:p-8">
              <div className="flex items-start gap-3">
                <Medal className="h-6 w-6 text-[#FFD166]" />
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.4em] text-white/70">
                    Daily spotlight
                  </p>
                  <blockquote className="text-lg leading-7">
                    “{todaysQuote.quote}”
                  </blockquote>
                  <p className="text-sm text-white/70">— {todaysQuote.author}</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#1F3C88]">
                    Achievement badges
                  </h2>
                  <p className="text-sm text-slate-500">
                    Badges unlock automatically when CareerWise verifies milestones.
                  </p>
                </div>
                <Badge variant="outline" className="border-[#1F3C88]/20 text-[#1F3C88]">
                  <Award className="mr-1 h-3.5 w-3.5" />
                  {achievements.filter((ach) => ach.unlockedAt).length} unlocked
                </Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-3xl border p-5 shadow-none",
                      achievement.unlockedAt
                        ? "border-[#00BFA6]/30 bg-[#ecfdf9]"
                        : "border-dashed border-slate-200 bg-white/70 text-slate-400",
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <p
                          className={cn(
                            "text-base font-semibold",
                            achievement.unlockedAt
                              ? "text-[#007864]"
                              : "text-slate-400",
                          )}
                        >
                          {achievement.title}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize",
                          achievement.tier === "gold" &&
                            "border-[#fbbf24]/40 text-[#b45309] bg-[#fef3c7]",
                          achievement.tier === "silver" &&
                            "border-[#94a3b8]/40 text-[#334155] bg-[#f8fafc]",
                          achievement.tier === "bronze" &&
                            "border-[#d97706]/40 text-[#92400e] bg-[#fff7ed]",
                        )}
                      >
                        {achievement.tier}
                      </span>
                    </div>
                    <p className="text-sm">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#007864]">
                        Unlocked {format(parseISO(achievement.unlockedAt), "MMM d")}
                      </p>
                    ) : (
                      <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                        Keep going — Almost there
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </main>
  );
}
