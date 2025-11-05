"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  Check,
  ChevronLeft,
  Clock4,
  Cloud,
  Loader2,
  MessageCircle,
  Mic,
  Rocket,
  Sparkles,
} from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 5;

const trackOptions = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Ship polished UIs with React, TypeScript, and design systems.",
    icon: Bot,
  },
  {
    id: "data",
    title: "Data Science",
    description: "Master analytics, experimentation, and storytelling with data.",
    icon: Sparkles,
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "Automate deployments and reliability with modern cloud tooling.",
    icon: Cloud,
  },
];

type EngagementMode = "voice" | "chat";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [goal, setGoal] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [mode, setMode] = useState<EngagementMode>("voice");
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    if (currentStep === 5) {
      setGenerationProgress(0);
      const interval = window.setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            window.clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 400);

      return () => window.clearInterval(interval);
    }
  }, [currentStep]);

  const progress = useMemo(
    () => Math.min((currentStep / TOTAL_STEPS) * 100, 100),
    [currentStep],
  );

  const goNext = () => {
    if (currentStep === TOTAL_STEPS) {
      return;
    }
    if (currentStep === 4) {
      setCurrentStep(5);
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    if (currentStep === 1) {
      return;
    }
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  return (
    <main className="min-h-screen bg-[#f5f8ff] font-[family:var(--font-inter)]">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-20 pt-16 md:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1F3C88] transition hover:text-[#153070]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to landing
        </Link>

        <FadeInSection className="w-full max-w-3xl">
          <Card className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_25px_100px_rgba(31,60,136,0.12)] backdrop-blur-xl md:p-12">
            <div className="absolute -right-16 top-10 hidden h-48 w-48 rounded-full bg-[#a5f3fc]/50 blur-3xl md:block" />
            <div className="absolute -left-20 -top-20 hidden h-56 w-56 rounded-full bg-[#c7d2fe]/60 blur-3xl md:block" />
            <div className="relative z-10 space-y-8">
              <header className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-500">
                    Step {currentStep} of {TOTAL_STEPS}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[#00BFA6] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </header>
              <div>{renderStep()}</div>
              {currentStep < 5 && currentStep !== 1 && (
                <nav className="flex flex-col justify-between gap-3 pt-2 sm:flex-row">
                  <div className="flex gap-2">
                    {currentStep > 1 ? (
                      <Button
                        variant="outline"
                        onClick={goBack}
                        className="h-12 min-w-[104px] rounded-full border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Back
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(2)}
                        className="h-12 min-w-[104px] rounded-full bg-white/40 px-6 text-base font-semibold text-slate-600 hover:bg-white/70"
                      >
                        Skip intro
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {currentStep === 1 && (
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(2)}
                        className="h-12 min-w-[120px] rounded-full border border-transparent px-6 text-base font-semibold text-[#1F3C88] hover:bg-[#1F3C88]/10"
                      >
                        Skip
                      </Button>
                    )}
                    <Button
                      onClick={goNext}
                      className="h-12 min-w-[140px] rounded-full bg-[#00BFA6] px-8 text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f]"
                    >
                      {currentStep === 4 ? "Generate plan" : "Next"}
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          </Card>
        </FadeInSection>
      </div>
    </main>
  );

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e0f2fe] px-4 py-1 text-sm font-semibold text-[#1F3C88]">
              <Mic className="h-4 w-4" />
              Voice intro
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-[#1F3C88] md:text-4xl">
                Hi, I’m CareerWise — your AI career mentor.
              </h1>
              <p className="text-lg text-slate-600 md:text-xl">
                Let’s take 2 minutes to personalise your plan.
              </p>
            </div>
            <AudioPulse />
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={goNext}
                className="h-12 min-w-[150px] rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-md shadow-[#00BFA6]/20 transition hover:bg-[#00a48f]"
              >
                Let’s Start
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="h-12 min-w-[150px] rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-slate-600 hover:bg-slate-50"
              >
                Skip intro
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
                What would you like to focus on?
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Choose the track that matches your next milestone.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {trackOptions.map((option) => {
                const Icon = option.icon;
                const isActive = option.id === selectedTrack;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedTrack(option.id)}
                    className={cn(
                      "group relative rounded-3xl border px-6 py-8 text-left transition-all",
                      "border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-[#00BFA6]/50 hover:shadow-[0_18px_40px_rgba(31,60,136,0.12)]",
                      isActive &&
                        "border-[#00BFA6] bg-[#ecfdf9] shadow-[0_18px_40px_rgba(0,191,166,0.25)]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mb-4 h-10 w-10 rounded-2xl bg-[#e0f2fe] p-2 text-[#1F3C88] transition",
                        isActive && "bg-[#00BFA6]/15 text-[#00BFA6]",
                      )}
                    />
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-[#1F3C88]">
                        {option.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {option.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#00BFA6] text-white shadow-md">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
                Tell me your goals and available time per week.
              </h2>
              <p className="text-lg text-slate-600">
                The more specific you are, the more tailored your sprint becomes.
              </p>
            </div>
            <div className="space-y-6">
              <label className="block">
                <span className="sr-only">Goal</span>
                <div className="relative flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 text-left shadow-sm focus-within:border-[#00BFA6] focus-within:ring-2 focus-within:ring-[#00BFA6]/30">
                  <input
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                    placeholder="What do you want to achieve?"
                    className="flex-1 bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                  <Rocket className="h-7 w-7 text-[#00BFA6]" />
                </div>
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <span>Hours per week</span>
                  <span className="rounded-full bg-[#ecfdf9] px-4 py-1 text-base font-semibold text-[#00BFA6]">
                    {hoursPerWeek}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={hoursPerWeek}
                  onChange={(event) =>
                    setHoursPerWeek(Number(event.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#d6e4ff]"
                  style={{
                    background: `linear-gradient(90deg, #00BFA6 ${((hoursPerWeek - 1) / 19) * 100}%, #d6e4ff ${((hoursPerWeek - 1) / 19) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
                How would you like me to mentor you?
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Pick your guidance style and nudge cadence.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(["voice", "chat"] as EngagementMode[]).map((option) => {
                const Icon = option === "voice" ? Mic : MessageCircle;
                const label =
                  option === "voice" ? "Voice Mode" : "Chat Mode";
                const description =
                  option === "voice"
                    ? "Hands-free coaching with conversational prompts."
                    : "Flexible async check-ins inside your inbox.";
                const isActive = mode === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMode(option)}
                    className={cn(
                      "flex flex-col gap-4 rounded-3xl border px-6 py-7 text-left transition-all hover:-translate-y-1 hover:border-[#00BFA6]/50 hover:shadow-[0_18px_40px_rgba(31,60,136,0.12)]",
                      "border-slate-200 bg-white",
                      isActive &&
                        "border-[#00BFA6] bg-[#ecfdf9] shadow-[0_18px_40px_rgba(0,191,166,0.25)]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f2fe] text-[#1F3C88]",
                          isActive && "bg-[#00BFA6]/15 text-[#00BFA6]",
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-xl font-semibold text-[#1F3C88]">
                        {label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Clock4 className="h-6 w-6 text-[#00BFA6]" />
                <p className="text-base font-semibold text-[#1F3C88]">
                  Nudges & summaries
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-slate-600 md:flex-row md:items-center md:gap-5">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dailyReminders}
                    onChange={(event) => setDailyReminders(event.target.checked)}
                    className="size-5 rounded border border-[#00BFA6]/40 text-[#00BFA6] focus:ring-[#00BFA6]"
                  />
                  Daily reminders
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={weeklySummary}
                    onChange={(event) => setWeeklySummary(event.target.checked)}
                    className="size-5 rounded border border-[#00BFA6]/40 text-[#00BFA6] focus:ring-[#00BFA6]"
                  />
                  Weekly summary
                </label>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="h-14 w-14 animate-spin text-[#00BFA6]" />
              <h2 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
                Generating your 14-day personalised plan…
              </h2>
              <p className="max-w-xl text-lg text-slate-600">
                CareerWise is analysing your goals, schedule, and preferred
                mentoring style.
              </p>
            </div>
            <div className="mx-auto h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#00BFA6] transition-all duration-300"
                style={{ width: `${Math.min(generationProgress, 100)}%` }}
              />
            </div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              {Math.min(Math.round(generationProgress), 100)}%
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="h-12 min-w-[150px] rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => setCurrentStep(4)}
              >
                Back
              </Button>
              <Button
                className="h-12 min-w-[150px] rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-lg transition hover:bg-[#00a48f] disabled:cursor-not-allowed disabled:bg-[#00BFA6]/40 disabled:text-white/80"
                onClick={() => {
                  if (generationProgress < 100) {
                    return;
                  }
                  router.push("/dashboard");
                }}
                disabled={generationProgress < 100}
              >
                View my plan
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }
}

function AudioPulse() {
  return (
    <div className="mx-auto flex h-20 max-w-xs items-end justify-center gap-2">
      {Array.from({ length: 12 }).map((_, index) => (
        <span
          key={index}
          className="audio-bar h-6 w-1 rounded-full bg-[#00BFA6]/80"
          style={{ animationDelay: `${index * 0.08}s` }}
        />
      ))}
    </div>
  );
}
