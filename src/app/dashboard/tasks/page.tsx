"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Mic,
  Sparkles,
} from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { difficultyMeta, mockTasks } from "@/data/mock-tasks";

const taskEntries = Object.values(mockTasks);

export default function TasksIndexPage() {
  const grouped = useMemo(() => {
    return {
      todays: taskEntries.filter((task) => task.due.includes("Today")),
      upcoming: taskEntries.filter((task) => task.due.includes("Tomorrow")),
      other: taskEntries.filter(
        (task) =>
          !task.due.includes("Today") && !task.due.includes("Tomorrow"),
      ),
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f6ff] pb-20 pt-12 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 lg:px-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-4">
            <Button
              variant="ghost"
              asChild
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f1f5ff] px-4 py-2 text-sm font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
                Daily tasks
              </h1>
              <p className="text-base text-slate-600">
                Progress through today’s sprint focus. CareerWise updates this list based on your plan version.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-[#00BFA6]/30 text-[#00BFA6]">
                {grouped.todays.length} to finish today
              </Badge>
              <Badge variant="outline" className="border-[#1F3C88]/30 text-[#1F3C88]">
                {taskEntries.length} total tasks queued
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Button
              asChild
              className="h-12 rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f]"
            >
              <Link href="/mentor?tab=chat">Sync with mentor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#1F3C88]/30 px-6 text-base font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
            >
              <Link href="/dashboard/tracker">Review plan roadmap</Link>
            </Button>
          </div>
        </header>

        <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
          <h2 className="text-xl font-semibold text-[#1F3C88]">Today</h2>
          <p className="text-sm text-slate-500">
            Complete these to maintain your streak and unlock tomorrow’s prompts.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {grouped.todays.map((task) => (
              <TaskCard key={task.id} taskId={task.id} />
            ))}
            {grouped.todays.length === 0 && (
              <Card className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
                No tasks for today. Check the upcoming list or add a focus block with your mentor.
              </Card>
            )}
          </div>
        </FadeInSection>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
            <h2 className="text-xl.Font-semibold text-[#1F3C88]">
              Upcoming
            </h2>
            <p className="text-sm text-slate-500">
              Prep ahead to smooth tomorrow’s sprint.
            </p>
            <ScrollArea className="mt-5 max-h-[360px] pr-3">
              <div className="space-y-4">
                {grouped.upcoming.map((task) => (
                  <TaskRow key={task.id} taskId={task.id} />
                ))}
                {grouped.upcoming.length === 0 && (
                  <Card className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
                    No upcoming tasks yet. CareerWise will add new items once you complete today’s focus.
                  </Card>
                )}
              </div>
            </ScrollArea>
          </FadeInSection>

          <FadeInSection className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-[#1F3C88] p-6 text-white shadow-[0_18px_80px_rgba(31,60,136,0.25)] backdrop-blur lg:p-8">
            <h3 className="text-lg font-semibold">Need a boost?</h3>
            <p className="text-sm text-white/80">
              Ping your mentor for personalised prompts or hop into a quick voice session without leaving the task view.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1 rounded-full bg-white text-[#1F3C88] hover:bg-slate-100" asChild>
                <Link href="/mentor?tab=chat">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat mentor
                </Link>
              </Button>
              <Button className="flex-1 rounded-full bg-[#00BFA6] text-white hover:bg-[#00a48f]" asChild>
                <Link href="/mentor?tab=voice">
                  <Mic className="mr-2 h-4 w-4" />
                  Start voice
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              <p className="font-semibold text-white/90">Mentor tip</p>
              <p className="mt-1 text-white/70">
                Stack deep work tasks back-to-back while momentum is high. I’ll queue lighter tasks for later today.
              </p>
            </div>
          </FadeInSection>
        </div>

        {grouped.other.length > 0 && (
          <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
            <h2 className="text-xl font-semibold text-[#1F3C88]">
              Later in sprint
            </h2>
            <p className="text-sm text-slate-500">
              Tasks queued for later in the plan. You can peek to plan your schedule.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {grouped.other.map((task) => (
                <TaskMiniCard key={task.id} taskId={task.id} />
              ))}
            </div>
          </FadeInSection>
        )}
      </div>
    </main>
  );
}

function TaskCard({ taskId }: { taskId: string }) {
  const task = mockTasks[taskId];
  const difficulty = difficultyMeta[task.difficulty];

  return (
    <Card className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-none transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,60,136,0.12)]">
      <div className="space-y-4">
        <Badge
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
            difficulty.tone,
          )}
        >
          {difficulty.label}
        </Badge>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#1F3C88]">{task.title}</h3>
          <p className="text-sm text-slate-600">{task.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        <span className="inline-flex items-center gap-2 text-slate-500">
          <Clock className="h-4 w-4 text-[#00BFA6]" />
          {task.estimatedMinutes}m
        </span>
        <span>{task.due}</span>
      </div>
      <div className="flex items-center justify-between pt-2">
        <Button asChild className="rounded-full bg-[#00BFA6] text-sm font-semibold text-white hover:bg-[#00a48f]">
          <Link href={`/dashboard/tasks/${task.id}`}>
            View task <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="text-[#1F3C88] hover:text-[#153070]">
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}

function TaskRow({ taskId }: { taskId: string }) {
  const task = mockTasks[taskId];
  const difficulty = difficultyMeta[task.difficulty];

  return (
    <Card className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/90 px-5 py-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <Badge
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold capitalize",
              difficulty.tone,
            )}
          >
            {difficulty.label}
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {task.due}
          </span>
        </div>
        <p className="text-base font-semibold text-[#1F3C88]">{task.title}</p>
        <p className="text-sm text-slate-500">{task.resource.title}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-full text-sm font-semibold">
          Plan deep work
        </Button>
        <Button asChild size="icon" className="rounded-full bg-[#00BFA6] text-white hover:bg-[#00a48f]">
          <Link href={`/dashboard/tasks/${task.id}`}>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function TaskMiniCard({ taskId }: { taskId: string }) {
  const task = mockTasks[taskId];

  return (
    <Card className="flex h-full flex-col justify-between gap-3 rounded-3xl border border-slate-200/60 bg-white/90 p-4">
      <div>
        <p className="text-sm font-semibold text-[#1F3C88]">{task.title}</p>
        <p className="mt-1 text-xs text-slate-500">{task.resource.title}</p>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        {task.difficulty.toUpperCase()} • {task.estimatedMinutes}M
      </p>
      <Button
        variant="ghost"
        asChild
        className="justify-start gap-2 px-0 text-sm font-semibold text-[#1F3C88] hover:text-[#153070]"
      >
        <Link href={`/dashboard/tasks/${task.id}`}>
          Preview <CheckCircle2 className="h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}
