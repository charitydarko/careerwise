"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const signupPerks = [
  "Track plan progress and unlock accountability nudges.",
  "Save voice notes plus async recaps from the mentor.",
  "Export your 14-day sprint with curated resources.",
];

export default function SignupPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }
    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[#f3f6ff] font-[family:var(--font-inter)]">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-16 lg:px-10">
        <div className="absolute -left-20 top-24 hidden h-72 w-72 rounded-full bg-[#a5f3fc]/40 blur-3xl lg:block" />
        <div className="absolute -right-16 bottom-16 hidden h-80 w-80 rounded-full bg-[#c7d2fe]/50 blur-3xl lg:block" />
        <div className="relative z-10 space-y-6 text-center lg:max-w-xl lg:text-left">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#1F3C88] shadow-sm backdrop-blur transition hover:bg-white"
          >
            ← Back to landing
          </Link>
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#00BFA6]">
              <Sparkles className="h-4 w-4" />
              Join CareerWise
            </span>
            <h1 className="text-4xl font-semibold text-[#1F3C88] md:text-5xl">
              Create your free account.
            </h1>
            <p className="text-lg text-slate-600 md:text-xl">
              Lock in your personalised sprint, sync progress, and keep the AI mentor alongside your workday.
            </p>
          </div>
          <ul className="space-y-3 text-left text-base text-slate-600">
            {signupPerks.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
              >
                <CheckCircle2 className="mt-1 h-5 w-5 text-[#00BFA6]" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="relative z-10 w-full rounded-[32px] border-white/80 bg-white/95 p-8 shadow-[0_25px_90px_rgba(31,60,136,0.12)] backdrop-blur">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-[#1F3C88]">Sign up to continue</h2>
            <p className="mt-2 text-sm text-slate-500">
              We’ll email you a magic link so you can pick up your plan anytime.
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1F3C88]">Full name</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-400 sm:block" />
                <Input
                  name="fullName"
                  placeholder="Alex Rivera"
                  className="h-12 rounded-full border-slate-200 bg-white pl-4 pr-4 text-base text-slate-700 sm:pl-12"
                  required
                />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1F3C88]">Work email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-400 sm:block" />
                <Input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-12 rounded-full border-slate-200 bg-white pl-4 pr-4 text-base text-slate-700 sm:pl-12"
                  required
                />
              </div>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1F3C88]">Create a passcode</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-400 sm:block" />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-full border-slate-200 bg-white pl-4 pr-4 text-base text-slate-700 sm:pl-12"
                  minLength={6}
                  required
                />
              </div>
            </label>
            <Button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="h-12 w-full rounded-full bg-[#00BFA6] text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {status === "success"
                ? "Magic link sent"
                : status === "submitting"
                  ? "Sending..."
                  : "Create free account"}
            </Button>
            {status === "success" && (
              <p className="rounded-2xl bg-[#ecfdf9] px-4 py-3 text-sm font-semibold text-[#007864]">
                Check your inbox. We emailed a link to confirm your account.
              </p>
            )}
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have access?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#1F3C88] hover:text-[#153070]"
            >
              Login
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
