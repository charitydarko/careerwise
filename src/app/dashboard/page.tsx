"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
  Settings,
  Sparkles,
} from "lucide-react";
import { VoicePanelV2 } from "@/components/voice/voice-panel-v2";
import { MentorInsights } from "@/components/dashboard/mentor-insights";

import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Difficulty = "starter" | "focus" | "deep";

type DailyTask = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  resourceUrl?: string;
  completed: boolean;
};

type PlanVersion = {
  id: string;
  label: string;
  currentDay: number;
  totalDays: number;
  progressPct: number;
  todayTasks: DailyTask[];
  achievements: Array<{
    id: string;
    title: string;
    subtitle: string;
    unlocked: boolean;
  }>;
  streakDays: number;
};

const mockPlans: PlanVersion[] = [
  {
    id: "v3",
    label: "Data Sprint · Rev 3",
    currentDay: 6,
    totalDays: 14,
    progressPct: 42,
    streakDays: 4,
    todayTasks: [
      {
        id: "task-1",
        title: "Design data story outline",
        description: "Draft narrative arc for stakeholder presentation.",
        difficulty: "focus",
        estimatedMinutes: 35,
        resourceUrl: "https://example.com/storytelling",
        completed: false,
      },
      {
        id: "task-2",
        title: "Segment retention cohorts",
        description: "Use SQL snippet to calculate Week 4 retention rate.",
        difficulty: "deep",
        estimatedMinutes: 45,
        resourceUrl: "https://example.com/sql-template",
        completed: true,
      },
      {
        id: "task-3",
        title: "Prep async update",
        description: "Record 2-min Loom with key learnings for mentor.",
        difficulty: "starter",
        estimatedMinutes: 15,
        completed: false,
      },
    ],
    achievements: [
      {
        id: "ach-1",
        title: "Consistency Streak",
        subtitle: "Logged daily for 4 days straight",
        unlocked: true,
      },
      {
        id: "ach-2",
        title: "Insight Synthesizer",
        subtitle: "Summarised 3+ analyses this sprint",
        unlocked: false,
      },
      {
        id: "ach-3",
        title: "Mentor Whisperer",
        subtitle: "Shared 5 voice updates",
        unlocked: true,
      },
    ],
  },
  {
    id: "v2",
    label: "Frontend Sprint · Rev 2",
    currentDay: 4,
    totalDays: 14,
    progressPct: 29,
    streakDays: 2,
    todayTasks: [
      {
        id: "task-a",
        title: "Refine component tokens",
        description: "Audit spacing + typography tokens in design system.",
        difficulty: "focus",
        estimatedMinutes: 30,
        resourceUrl: "https://example.com/design-tokens",
        completed: false,
      },
      {
        id: "task-b",
        title: "Build empty states",
        description: "Ship 2 empty-state components with animations.",
        difficulty: "deep",
        estimatedMinutes: 50,
        completed: false,
      },
      {
        id: "task-c",
        title: "Post in community",
        description: "Share today’s blocker for async feedback.",
        difficulty: "starter",
        estimatedMinutes: 12,
        completed: true,
      },
    ],
    achievements: [
      {
        id: "ach-a",
        title: "Daily Ship",
        subtitle: "Shipped UI updates 3 days running",
        unlocked: true,
      },
      {
        id: "ach-b",
        title: "Feedback Seeker",
        subtitle: "Requested 5 code reviews",
        unlocked: false,
      },
    ],
  },
];

const difficultyMap: Record<
  Difficulty,
  { label: string; className: string; icon?: React.ReactNode }
> = {
  starter: {
    label: "Starter",
    className:
      "bg-[#ecfdf9] text-[#007864] border border-[#00BFA6]/30",
  },
  focus: {
    label: "Focus",
    className:
      "bg-[#e0f2fe] text-[#1F3C88] border border-[#1F3C88]/20",
  },
  deep: {
    label: "Deep Work",
    className:
      "bg-[#fef3c7] text-[#b45309] border border-[#f59e0b]/30",
  },
};

export default function CurriculumDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showTextChat, setShowTextChat] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [progressRes, tasksRes, achievementsRes] = await Promise.all([
          fetch("/api/user/progress"),
          fetch("/api/tasks"),
          fetch("/api/achievements"),
        ]);

        if (progressRes.ok) {
          const data = await progressRes.json();
          setUserData(data);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks);
        }

        if (achievementsRes.ok) {
          const achievementsData = await achievementsRes.json();
          setAchievements(achievementsData.achievements);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedPlan = useMemo(() => {
    if (!userData) return mockPlans[0];

    const profile = userData.profile;
    const progress = userData.progress;

    return {
      id: "v1",
      label: `${profile?.careerTrack || "Career"} Sprint · v1`,
      currentDay: progress?.currentDay || 1,
      totalDays: progress?.totalDays || 14,
      progressPct: progress?.progressPercent || 0,
      streakDays: progress?.streakDays || 0,
      todayTasks: tasks,
      achievements: achievements.map(a => ({
        id: a.id,
        title: a.title,
        subtitle: a.subtitle,
        unlocked: a.unlocked,
      })),
    };
  }, [userData, tasks, achievements]);

  const progressCopy = useMemo(() => {
    if (!selectedPlan) {
      return "";
    }
    const { currentDay, totalDays } = selectedPlan;
    return `Day ${currentDay} · ${Math.round((currentDay / totalDays) * 100)}% of sprint`;
  }, [selectedPlan]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f6ff]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1F3C88] border-t-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (!selectedPlan) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f3f6ff] pb-16 pt-12 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 lg:px-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
              Your plan
            </span>
            <h1 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
              {userData?.user?.name ? `Welcome back, ${userData.user.name}!` : "CareerWise Dashboard"}
            </h1>
            <p className="text-base text-slate-600">
              {progressCopy} · Last sync {format(new Date(), "MMM d, h:mma")}
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-[#1F3C88]"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
            <div className="rounded-3xl border border-[#00BFA6]/20 bg-[#ecfdf9] px-5 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#007864]">
                Career Track
              </p>
              <p className="text-lg font-semibold capitalize text-[#1F3C88]">
                {userData?.profile?.careerTrack || "Not set"}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="space-y-6">
            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#1F3C88] flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#00BFA6]" />
                  Mentor Insights
                </h3>
                <MentorInsights />
              </div>
            </FadeInSection>

            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              {/* Current day section ... */}

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
                    <CalendarCheck className="h-4 w-4 text-[#00BFA6]" />
                    <span>Current day</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1F3C88] md:text-3xl">
                    Day {selectedPlan.currentDay} · {selectedPlan.totalDays - selectedPlan.currentDay} days left
                  </h2>
                  <p className="text-base text-slate-600">
                    Stay on track to unlock your milestone. Focus tasks are tuned to today’s goal.
                  </p>
                </div>
                <div className="flex w-full max-w-xs flex-col gap-2 rounded-3xl border border-[#00BFA6]/20 bg-[#ecfdf9] p-5 text-center">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#007864]">
                    Progress
                  </span>
                  <span className="text-4xl font-extrabold text-[#00BFA6]">
                    {selectedPlan.progressPct}%
                  </span>
                  <div className="h-2 rounded-full bg-white/70">
                    <div
                      className="h-full rounded-full bg-[#00BFA6]"
                      style={{ width: `${selectedPlan.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="flex items-center justify-between pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-[#1F3C88]">
                    Today’s tasks
                  </h3>
                  <p className="text-sm text-slate-500">
                    Complete to keep your streak alive.
                  </p>
                </div>
              </div>
              <ScrollArea className="h-[360px] pr-4">
                <div className="space-y-4">
                  {selectedPlan.todayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={async () => {
                        // Refresh data after task completion
                        const [progressRes, tasksRes, achievementsRes] = await Promise.all([
                          fetch("/api/user/progress"),
                          fetch("/api/tasks"),
                          fetch("/api/achievements"),
                        ]);
                        if (progressRes.ok) {
                          const data = await progressRes.json();
                          setUserData(data);
                        }
                        if (tasksRes.ok) {
                          const tasksData = await tasksRes.json();
                          setTasks(tasksData.tasks);
                        }
                        if (achievementsRes.ok) {
                          const achievementsData = await achievementsRes.json();
                          setAchievements(achievementsData.achievements);
                        }
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </FadeInSection>

            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="flex items-center justify-between pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-[#1F3C88]">
                    Achievements
                  </h3>
                  <p className="text-sm text-slate-500">
                    Auto-unlocked when you hit key milestones.
                  </p>
                </div>
                <Badge variant="outline" className="border-[#1F3C88]/20 text-[#1F3C88]">
                  <Flame className="mr-1 h-3.5 w-3.5 text-[#ff7b54]" />
                  {selectedPlan.streakDays}-day streak
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {selectedPlan.achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={cn(
                      "flex flex-col gap-2 rounded-3xl border p-5 shadow-none transition",
                      achievement.unlocked
                        ? "border-[#00BFA6]/30 bg-[#ecfdf9]"
                        : "border-dashed border-slate-200 bg-white/70 text-slate-400",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          "text-base font-semibold",
                          achievement.unlocked
                            ? "text-[#007864]"
                            : "text-slate-400",
                        )}
                      >
                        {achievement.title}
                      </p>
                      {achievement.unlocked ? (
                        <CheckCircle2 className="h-5 w-5 text-[#00BFA6]" />
                      ) : (
                        <Sparkles className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                    <p className="text-sm">
                      {achievement.subtitle}
                    </p>
                  </Card>
                ))}
              </div>
            </FadeInSection>
          </section>

          <aside className="space-y-6">
            <FadeInSection>
              <VoicePanelV2
                context={{
                  userId: userData?.user?.id || "demo-user",
                  careerTrack: userData?.profile?.careerTrack || "frontend",
                  learningLevel: userData?.profile?.learningLevel || "beginner",
                  currentPhase: userData?.progress?.currentPhase || "fundamentals",
                  currentTopic: "Sprint planning and daily tasks",
                }}
                onModeSwitch={() => setShowTextChat(true)}
              />
            </FadeInSection>

            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#1F3C88]">
                  Progress tracker summary
                </h3>
                <p className="text-sm text-slate-500">
                  Snapshot of your sprint momentum, drawn from plan analytics.
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <SummaryRow
                  label="Completion"
                  value={`${selectedPlan.progressPct}%`}
                  description="Percent of planned tasks completed."
                />
                <SummaryRow
                  label="Deep work minutes"
                  value={`${selectedPlan.todayTasks
                    .filter((task) => task.difficulty === "deep")
                    .reduce((acc, task) => acc + task.estimatedMinutes, 0)}m`}
                  description="High-focus sessions queued today."
                />
                <SummaryRow
                  label="Voice sessions"
                  value="3"
                  description="AI mentor conversations this week."
                />
              </div>
            </FadeInSection>
          </aside>
        </div>
      </div>
    </main>
  );
}

function TaskCard({ task, onToggle }: { task: DailyTask; onToggle?: () => void }) {
  const meta = difficultyMap[task.difficulty];
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (response.ok && onToggle) {
        onToggle();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-3 rounded-3xl border p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,60,136,0.08)]",
        task.completed ? "border-[#00BFA6]/40 bg-[#ecfdf9]" : "border-slate-200 bg-white/90",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4
            className={cn(
              "text-lg font-semibold text-[#1F3C88]",
              task.completed && "text-[#007864]",
            )}
          >
            {task.title}
          </h4>
          <p className="text-sm text-slate-500">{task.description}</p>
        </div>
        <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-xs font-semibold", meta.className)}>
          {meta.label}
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
        <span className="inline-flex items-center gap-2 text-slate-500">
          <Clock className="h-4 w-4 text-[#00BFA6]" />
          <span>{task.estimatedMinutes}m</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <Button
          variant="outline"
          className="rounded-full px-4 py-2 text-sm font-semibold"
          onClick={() => task.resourceUrl && window.open(task.resourceUrl, "_blank")}
          disabled={!task.resourceUrl}
        >
          {task.resourceUrl ? "Open resource" : "No external resource"}
        </Button>
        <Button
          onClick={handleToggle}
          disabled={isUpdating}
          variant={task.completed ? "outline" : "default"}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            task.completed
              ? "border-[#00BFA6] bg-white text-[#00BFA6] hover:bg-[#ecfdf9]"
              : "bg-[#00BFA6] text-white hover:bg-[#00a48f]"
          )}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : task.completed ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            "Mark complete"
          )}
        </Button>
      </div>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.3em]">
          {label}
        </p>
        <span className="text-xl font-semibold text-[#1F3C88]">{value}</span>
      </div>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
