"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Headset, MessageSquare, Phone, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const responseHighlights = [
  {
    title: "Live mentor desk",
    detail: "Weekdays 9am–7pm PT · Slack or voice call within 2 hours.",
    icon: Headset,
  },
  {
    title: "Async inbox",
    detail: "Email support@careerwise.ai and get a human reply within 1 business day.",
    icon: MessageSquare,
  },
  {
    title: "Emergency phone",
    detail: "+1 (415) 555-0142 for access issues or billing locks.",
    icon: Phone,
  },
];

export default function SupportPage() {
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
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-start lg:gap-16 lg:px-10">
        <div className="absolute -left-24 top-28 hidden h-72 w-72 rounded-full bg-[#a5f3fc]/45 blur-3xl lg:block" />
        <div className="absolute -right-16 bottom-10 hidden h-80 w-80 rounded-full bg-[#c7d2fe]/55 blur-3xl lg:block" />
        <section className="relative z-10 flex-1 space-y-6 text-center lg:text-left">
          <Button
            asChild
            variant="ghost"
            className="mx-auto w-fit rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#1F3C88] shadow-sm backdrop-blur hover:bg-white lg:mx-0"
          >
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to landing
            </Link>
          </Button>
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#00BFA6]">
              <Sparkles className="h-4 w-4" />
              Support team
            </span>
            <h1 className="text-4xl font-semibold text-[#1F3C88] md:text-5xl">
              Contact CareerWise support.
            </h1>
            <p className="text-lg text-slate-600 md:text-xl">
              We’re here to unblock onboarding, billing, or mentor access within a couple of hours.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {responseHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="rounded-3xl border-white/70 bg-white/95 p-5 text-left shadow-[0_18px_70px_rgba(31,60,136,0.12)]"
                >
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-[#e0f2fe] text-[#1F3C88]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-base font-semibold text-[#1F3C88]">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                </Card>
              );
            })}
          </div>
        </section>
        <Card className="relative z-10 flex-1 rounded-[32px] border-white/80 bg-white/95 p-8 shadow-[0_25px_90px_rgba(31,60,136,0.12)] backdrop-blur">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-[#1F3C88]">Send a message</h2>
            <p className="mt-2 text-sm text-slate-500">
              Drop us context and we’ll follow up on your preferred channel.
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1F3C88]">Full name</span>
              <Input
                name="fullName"
                placeholder="Jordan Malik"
                required
                className="h-12 rounded-full border-slate-200 bg-white px-4 text-base text-slate-700"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1F3C88]">Work email</span>
              <Input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="h-12 rounded-full border-slate-200 bg-white px-4 text-base text-slate-700"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1F3C88]">What do you need help with?</span>
              <Textarea
                name="message"
                placeholder="Share as much context as possible so we can resolve this quickly."
                rows={5}
                required
                className="rounded-3xl border-slate-200 bg-white px-4 py-3 text-base text-slate-700"
              />
            </label>
            <Button
              type="submit"
              disabled={status === "submitting" || status === "sent"}
              className="h-12 w-full rounded-full bg-[#00BFA6] text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {status === "sent"
                ? "Message sent"
                : status === "submitting"
                  ? "Sending..."
                  : "Contact support"}
            </Button>
            {status === "sent" && (
              <p className="rounded-2xl bg-[#ecfdf9] px-4 py-3 text-sm font-semibold text-[#007864]">
                Thanks! We’ll reply shortly via email and your mentor inbox.
              </p>
            )}
          </form>
          <div className="mt-8 space-y-1 text-center text-sm text-slate-500">
            <p>Prefer live chat? Ping us inside the mentor at any time.</p>
            <p>
              Response time SLA: <span className="font-semibold text-[#1F3C88]">under 2 hours</span> on business days.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
