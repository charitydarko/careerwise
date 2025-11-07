"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }
    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("sent");
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[#f3f6ff] font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-16">
        <Button
          asChild
          variant="ghost"
          className="w-fit rounded-full bg-white/80 text-sm font-semibold text-[#1F3C88] backdrop-blur hover:bg-white"
        >
          <Link href="/login" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </Button>
        <Card className="rounded-[32px] border-white/70 bg-white/95 p-8 shadow-[0_20px_80px_rgba(31,60,136,0.12)] backdrop-blur">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#1F3C88]">
              <RefreshCw className="h-4 w-4" />
              Reset access
            </div>
            <h1 className="text-3xl font-semibold text-[#1F3C88]">
              Forgot your passcode?
            </h1>
            <p className="text-base text-slate-600">
              Enter the email tied to your CareerWise account and we’ll send a reset link.
            </p>
          </div>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
            <Button
              type="submit"
              disabled={status === "submitting" || status === "sent"}
              className="h-12 w-full rounded-full bg-[#00BFA6] text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {status === "sent"
                ? "Email sent"
                : status === "submitting"
                  ? "Sending..."
                  : "Send reset link"}
            </Button>
            {status === "sent" && (
              <p className="rounded-2xl bg-[#ecfdf9] px-4 py-3 text-sm font-semibold text-[#007864]">
                Check your inbox for instructions to reset your passcode.
              </p>
            )}
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Don’t see the email? Check spam or{" "}
            <Link
              href="/support"
              className="font-semibold text-[#1F3C88] hover:text-[#153070]"
            >
              contact support
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  );
}
