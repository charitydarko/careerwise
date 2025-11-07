"use client";

import Link from "next/link";
import { useState } from "react";
import { Mic, PauseCircle, Waves } from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VoiceOnboardingPage() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f8ff] pb-20 pt-14 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 lg:px-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_25px_90px_rgba(31,60,136,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e0f2fe] px-4 py-2 text-sm font-semibold text-[#1F3C88]">
              <Waves className="h-4 w-4" />
              Voice onboarding
            </div>
            <h1 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
              Personalise your plan hands-free
            </h1>
            <p className="text-base text-slate-600">
              Tell CareerWise about your goals, weekly availability, and preferred coaching style in a quick voice conversation.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#1F3C88]/30 px-6 text-sm font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
            >
              <Link href="/onboarding">Switch to guided steps</Link>
            </Button>
            <Button
              className="rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f]"
              onClick={() => {
                setIsRecording((prev) => !prev);
                window.open("/mentor?tab=voice", "mentor-voice", "noopener,noreferrer");
              }}
            >
              {isRecording ? (
                <span className="inline-flex items-center gap-2">
                  <PauseCircle className="h-5 w-5" />
                  Stop recording
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Start voice session
                </span>
              )}
            </Button>
          </div>
        </header>

        <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur md:p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="flex flex-col gap-4 rounded-3xl border border-[#00BFA6]/30 bg-[#ecfdf9] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#007864]">
                Conversation guide
              </p>
              <ol className="space-y-3 text-sm text-[#1F3C88]">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#007864]">1</span>
                  Share your career goal or role transition timeline.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#007864]">2</span>
                  Mention how many hours you can commit each week.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#007864]">3</span>
                  Choose if you prefer voice check-ins or async chat updates.
                </li>
              </ol>
            </Card>

            <Card className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                What happens next
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>CareerWise captures your answers and drafts a 14-day plan automatically.</li>
                <li>A quick summary appears in the mentor workspace for easy editing.</li>
                <li>Hop back to the dashboard when you’re ready to review your personalised tasks.</li>
              </ul>
              <Button
                asChild
                variant="ghost"
                className="self-start text-sm font-semibold text-[#1F3C88] hover:text-[#153070]"
              >
                <Link href="/dashboard">Return to dashboard</Link>
              </Button>
            </Card>
          </div>
        </FadeInSection>
      </div>
    </main>
  );
}
