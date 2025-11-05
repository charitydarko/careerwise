"use client";

import { useMemo, useState } from "react";
import { addDays, format, parseISO } from "date-fns";
import { CalendarRange, ChevronRight, Flame, ListChecks, Timer } from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type SprintDay = {
  id: string;
  dayNumber: number;
  focusTheme: string;
  summary: string;
  status: "complete" | "in-progress" | "up-next";
  startDate: string;
  deepWorkMinutes: number;
  tasksComplete: number;
  tasksTotal: number;
};

const sprintData: SprintDay[] = Array.from({ length: 14 }).map((_, index) => {
  const dayNumber = index + 1;
  return {
    id: `day-${dayNumber}`,
    dayNumber,
    focusTheme: [
      "Foundation Research",
      "Problem Framing",
      "Hypothesis Mapping",
      "Data Discovery",
      "Narrative Shape",
      "Insight Synthesis",
      "Stakeholder Draft",
    ][index % 7],
    summary:
      "Focus on pulling actionable insights and wrapping with your mentor in voice updates.",
    status:
      dayNumber < 6 ? "complete" : dayNumber === 6 ? "in-progress" : "up-next",
    startDate: format(addDays(new Date(), index - 5), "yyyy-MM-dd"),
    deepWorkMinutes: 45 + (index % 3) * 15,
    tasksComplete: Math.min(3, 1 + (index % 4)),
    tasksTotal: 3,
  };
});

export default function SprintTrackerPage() {
  const [activeDayId, setActiveDayId] = useState<string>(sprintData[5].id);

  const activeDay = useMemo(
    () => sprintData.find((day) => day.id === activeDayId) ?? sprintData[0],
    [activeDayId],
  );

  return (
    <main className="min-h-screen bg-[#f3f6ff] pb-16 pt-12 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 lg:px-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-2">
            <Button
              variant="ghost"
              asChild
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f1f5ff] px-4 py-2 text-sm font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                Dashboard
                <ChevronRight className="h-4 w-4" />
                Sprint tracker
              </a>
            </Button>
            <h1 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
              Sprint Tracker
            </h1>
            <p className="text-base text-slate-600">
              Visualise how your 14-day plan unfolds. Completed days auto-sync from your daily tasks.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-[#1F3C88] px-5 py-4 text-white shadow-lg shadow-[#1F3C88]/30">
            <Flame className="h-6 w-6 text-[#FFD166]" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Streak
              </p>
              <p className="text-lg font-semibold">4 days active</p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="inline-flex rounded-full bg-white/70 p-1 shadow-md">
            <TabsTrigger
              value="timeline"
              className="rounded-full px-6 py-2 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-full px-6 py-2 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="grid gap-6 md:grid-cols-[260px_auto]">
                <ScrollArea className="h-[420px] rounded-3xl border border-slate-200/70 bg-white/60">
                  <div className="divide-y divide-slate-200/70">
                    {sprintData.map((day) => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => setActiveDayId(day.id)}
                        className={cn(
                          "flex w-full flex-col gap-2 px-5 py-4 text-left transition hover:bg-[#e4ebff]",
                          activeDayId === day.id && "bg-[#1F3C88] text-white",
                        )}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                          <span>
                            Day {day.dayNumber} ·{" "}
                            {format(parseISO(day.startDate), "MMM d")}
                          </span>
                          <span>
                            {day.status === "complete"
                              ? "Complete"
                              : day.status === "in-progress"
                                ? "Now"
                                : "Up next"}
                          </span>
                        </div>
                        <p className="text-sm font-semibold">
                          {day.focusTheme}
                        </p>
                        <p className="text-xs text-slate-500">
                          Deep work: {day.deepWorkMinutes}m · Tasks{" "}
                          {day.tasksComplete}/{day.tasksTotal}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>

                <Card className="flex flex-col gap-6 rounded-3xl border border-slate-200/60 bg-white/90 p-6">
                  <div className="space-y-2 border-b border-slate-200/70 pb-4">
                    <Badge variant="outline" className="border-[#1F3C88]/20 text-[#1F3C88]">
                      <CalendarRange className="mr-2 h-3.5 w-3.5 text-[#00BFA6]" />
                      {format(parseISO(activeDay.startDate), "EEEE, MMM d")}
                    </Badge>
                    <h2 className="text-2xl font-semibold text-[#1F3C88]">
                      Day {activeDay.dayNumber}: {activeDay.focusTheme}
                    </h2>
                    <p className="text-sm text-slate-600">{activeDay.summary}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TrackerMetric
                      label="Status"
                      value={
                        activeDay.status === "complete"
                          ? "Completed"
                          : activeDay.status === "in-progress"
                            ? "In progress"
                            : "Starting tomorrow"
                      }
                    />
                    <TrackerMetric
                      label="Deep work minutes"
                      value={`${activeDay.deepWorkMinutes} mins`}
                      icon={<Timer className="h-5 w-5 text-[#00BFA6]" />}
                    />
                    <TrackerMetric
                      label="Tasks complete"
                      value={`${activeDay.tasksComplete}/${activeDay.tasksTotal}`}
                      icon={<ListChecks className="h-5 w-5 text-[#1F3C88]" />}
                    />
                  </div>
                  <Button className="self-start rounded-full bg-[#00BFA6] px-6 text-white hover:bg-[#00a48f]">
                    Review mentor notes
                  </Button>
                </Card>
              </div>
            </FadeInSection>
          </TabsContent>

          <TabsContent value="analytics">
            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 text-center text-[#1F3C88] shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-12">
              <p className="text-lg">
                Sprint analytics will display aggregated trends from your plan
                history. Hook this tab to Prisma charts once available.
              </p>
            </FadeInSection>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function TrackerMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-left">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          {label}
        </p>
        <p className="mt-2 text-lg font-semibold text-[#1F3C88]">{value}</p>
      </div>
      {icon && <div className="rounded-2xl bg-[#f1f5ff] p-3">{icon}</div>}
    </div>
  );
}
