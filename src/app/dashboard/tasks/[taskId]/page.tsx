"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Mic,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { difficultyMeta, mockTasks, type TaskId } from "@/data/mock-tasks";

export default function TaskDetailPage({
  params,
}: {
  params: { taskId: TaskId };
}) {
  const task = mockTasks[params.taskId] ?? mockTasks["insight-brief"];
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const difficulty = useMemo(() => difficultyMeta[task.difficulty], [task]);

  const toggleChecklist = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

  return (
    <main className="min-h-screen bg-[#f3f6ff] pb-24 pt-12 font-[family:var(--font-inter)]">
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
                {task.title}
              </h1>
              <p className="text-base text-slate-600">{task.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  difficulty.tone,
                )}
              >
                {difficulty.label}
              </Badge>
              <Badge variant="outline" className="border-[#00BFA6]/40 text-[#00BFA6]">
                {task.estimatedMinutes} minute focus
              </Badge>
              <Badge variant="outline" className="border-[#1F3C88]/30 text-[#1F3C88]">
                Due {task.due}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Button
              className="h-12 rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f]"
              onClick={handleMarkComplete}
              disabled={isCompleted}
            >
              {isCompleted ? "Completed" : "Mark Complete"}
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-full border-[#1F3C88]/30 px-6 text-base font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
            >
              Ask Mentor
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <FadeInSection className="flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-[#1F3C88]">
                Task checklist
              </h2>
              <ul className="space-y-3">
                {task.checklist.map((item, index) => {
                  const checked = completedSteps.includes(index);
                  return (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => toggleChecklist(index)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-left text-sm text-slate-600 transition hover:-translate-y-0.5 hover:shadow-md",
                          checked && "border-[#00BFA6]/50 bg-[#ecfdf9] text-[#007864]",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 inline-flex size-6 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-semibold uppercase tracking-[0.2em]",
                            checked && "border-[#00BFA6] bg-[#00BFA6] text-white",
                          )}
                        >
                          {checked ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </span>
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-[#1F3C88]">
                <Sparkles className="h-5 w-5 text-[#FFD166]" />
                Mentor tip
              </h2>
              <Card className="border border-[#1F3C88]/15 bg-[#f6f9ff] p-5 text-slate-600">
                {task.mentorTip}
              </Card>
            </section>
          </FadeInSection>

          <div className="space-y-6">
            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1F3C88]">
                    Learning resource preview
                  </h3>
                  <p className="text-sm text-slate-500">
                    Review the resource, then capture key notes in your sprint doc.
                  </p>
                </div>
                <Badge variant="outline" className="border-[#00BFA6]/30 text-[#00BFA6]">
                  {task.resource.type}
                </Badge>
              </div>
              <div className="mt-4 space-y-4 rounded-3xl border border-slate-200/60 bg-white/90 p-5">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-1 h-5 w-5 text-[#1F3C88]" />
                  <div>
                    <p className="text-base font-semibold text-[#1F3C88]">
                      {task.resource.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.resource.description}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <iframe
                    src={task.resource.embed}
                    title={task.resource.title}
                    className="h-56 w-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                </div>
                <Button
                  variant="ghost"
                  asChild
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#1F3C88] hover:text-[#153070]"
                >
                  <a href={task.resource.url} target="_blank" rel="noopener noreferrer">
                    Open full resource
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </FadeInSection>

            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <h3 className="text-lg font-semibold text-[#1F3C88]">
                Voice mentor quick note
              </h3>
              <ScrollArea className="mt-3 h-40 rounded-2xl border border-slate-200/60 bg-[#f6f9ff] p-4">
                <p className="text-sm text-slate-600">
                  “When you post your outline, highlight the tension you’re resolving.
                  Stakeholders love clear contrast between the problem and your recommendation.”
                </p>
              </ScrollArea>
              <div className="mt-4 flex gap-3">
                <Button
                  asChild
                  className="flex-1 rounded-full bg-[#1F3C88] text-white hover:bg-[#153070]"
                >
                  <Link href="/mentor?tab=chat">Send async update</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/mentor?tab=chat">Save to notebook</Link>
                </Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
      <div className="pointer-events-none fixed bottom-10 right-10 z-30 flex flex-col items-end gap-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-3xl bg-[#1F3C88] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#1F3C88]/30">
          <span>Need help?</span>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="size-10 rounded-full bg-white/20 text-white hover:bg-white/30"
              asChild
            >
              <Link href="/mentor?tab=chat">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="size-10 rounded-full bg-[#00BFA6] text-white hover:bg-[#00a48f]"
              asChild
            >
              <Link href="/mentor?tab=voice">
                <Mic className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <Button
          asChild
          size="icon"
          className="pointer-events-auto size-14 rounded-full bg-[#00BFA6] text-white shadow-[0_20px_50px_rgba(0,191,166,0.35)] transition hover:bg-[#00a48f]"
        >
          <Link href="/mentor?tab=chat">
            <MessageCircle className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
