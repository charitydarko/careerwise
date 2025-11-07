import type { ComponentType, SVGProps } from "react";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Linkedin,
  MessageCircle,
  Quote,
  TrendingUp,
  Twitter,
  Youtube,
} from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Talk",
    description: "Tell CareerWise your goals.",
    icon: MessageCircle,
  },
  {
    title: "Plan",
    description: "Receive a personalised 14-day curriculum.",
    icon: ClipboardList,
  },
  {
    title: "Progress",
    description: "Daily check-ins to keep you moving.",
    icon: TrendingUp,
  },
];

const proofPoints = [
  {
    label: "Stanford 2023",
    detail: "AI tutoring improved concept mastery by 37%.",
  },
  {
    label: "LinkedIn Learning",
    detail: "68% of learners prefer adaptive content.",
  },
  {
    label: "CareerWise beta",
    detail: "90% finished their 2-week plan.",
  },
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Product Designer",
    quote: "CareerWise helped me kick-start a UX portfolio in two weeks.",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
  },
  {
    name: "Luis Fernandez",
    role: "Data Analyst",
    quote: "The daily nudges kept me consistent and focused.",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb44696608c",
  },
  {
    name: "Anika Bose",
    role: "AI Research Fellow",
    quote: "Learning feels human — but supercharged.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  },
];

export default function Home() {
  return (
    <main className="bg-[#f6f9ff] text-slate-900">
      <HeroSection />
      <HowItWorksSection />
      <MarketProofSection />
      <SocialProofSection />
      <FooterSection />
      <FloatingLoginButton />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="absolute -left-40 top-24 hidden h-72 w-72 rounded-full bg-[#dbeafe] blur-3xl md:block" />
      <div className="absolute -right-32 bottom-0 hidden h-80 w-80 rounded-full bg-[#a7f3d0] blur-3xl md:block" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-24 md:flex-row md:items-center md:px-8 lg:px-12">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1F3C88] shadow-sm backdrop-blur">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#00BFA6]" />
            AI mentorship that adapts to you
          </span>
          <h1 className="mt-6 font-[family:var(--font-inter)] text-[52px] font-extrabold leading-tight text-[#1F3C88] md:text-[64px] lg:text-[72px]">
            Your AI Career Mentor
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 md:text-xl">
            Talk for 15 minutes — get a 14-day plan that adapts to your goals.
            CareerWise guides you with strategic checkpoints, personalised
            resources, and gentle accountability.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-[#00BFA6] px-8 text-lg font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f]"
            >
              <Link href="/onboarding">Get Started</Link>
            </Button>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-lg font-semibold text-[#1F3C88] transition hover:text-[#153070]"
            >
              See How It Works
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg md:mx-0">
      <div className="absolute inset-0 -translate-y-8 translate-x-6 rotate-6 rounded-[32px] bg-gradient-to-br from-[#c7d2fe] via-[#bfdbfe] to-[#bbf7d0] opacity-60 blur-3xl animate-float" />
      <Card className="relative z-10 overflow-hidden rounded-[28px] border-white/60 bg-white/80 p-6 shadow-[0_25px_90px_rgba(31,60,136,0.12)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F3C88] text-white shadow-lg">
            <Image
              src="/logo.svg"
              alt="CareerWise avatar"
              width={28}
              height={28}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">AI Mentor</p>
            <p className="text-lg font-semibold text-slate-800">CareerWise</p>
          </div>
          <span className="ml-auto rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-semibold text-[#1F3C88]">
            Online
          </span>
        </div>
        <div className="mt-6 space-y-4">
          <ChatBubble
            align="left"
            tone="primary"
            title="Kick-off session"
            content="Tell me what skill or role you want to accelerate. I’ll build a sprint around it."
          />
          <ChatBubble
            align="right"
            tone="neutral"
            title="You"
            content="I’m aiming to land a product analytics role in tech within 3 months."
          />
          <ChatBubble
            align="left"
            tone="primary"
            title="CareerWise"
            content="Great! Here’s your personalised 14-day roadmap with focused prompts, curated resources, and daily nudges."
          />
        </div>
        <div className="mt-6 rounded-2xl bg-[#f4f7ff] p-4">
          <p className="text-sm font-semibold text-[#1F3C88]">Next 14 days</p>
          <div className="mt-3 grid grid-cols-4 gap-3 text-xs font-medium text-slate-600">
            {["Focus", "Practice", "Apply", "Reflect"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[#d6e4ff] bg-white/70 px-3 py-2 text-center shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

type ChatBubbleProps = {
  align: "left" | "right";
  tone: "primary" | "neutral";
  title: string;
  content: string;
};

function ChatBubble({ align, tone, title, content }: ChatBubbleProps) {
  const isLeft = align === "left";
  const bubbleStyles =
    tone === "primary"
      ? "bg-white/90 text-slate-700 border border-slate-100 shadow-[0_10px_40px_rgba(31,60,136,0.08)]"
      : "bg-[#1F3C88] text-white shadow-[0_10px_40px_rgba(31,60,136,0.22)]";

  return (
    <div
      className={cn(
        "max-w-sm rounded-3xl px-5 py-4 transition-transform duration-500",
        bubbleStyles,
        isLeft ? "self-start" : "self-end",
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wide",
          tone === "primary" ? "text-[#1F3C88]" : "text-white/80",
        )}
      >
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function FloatingLoginButton() {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-30 sm:bottom-8 sm:right-8">
      <Button
        asChild
        size="lg"
        className="pointer-events-auto rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-[0_15px_50px_rgba(0,191,166,0.35)] hover:bg-[#009f8b]"
      >
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-6xl px-6 py-24 md:px-8 lg:px-12"
    >
      <FadeInSection className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
          How CareerWise Works
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Three simple steps to keep your momentum, backed by AI mentorship that
          learns how you learn.
        </p>
      </FadeInSection>

      <div className="mt-14 space-y-6 md:flex md:items-stretch md:gap-7 md:space-y-0">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <FadeInSection
              key={step.title}
              delay={index * 120}
              className="relative flex-1"
            >
              <Card className="flex h-full flex-col gap-6 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-lg shadow-[#1f3c88]/5 backdrop-blur">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e0e9ff] text-[#1F3C88] shadow-inner">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Step {index + 1}
                  </p>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-base leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </Card>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block md:absolute md:-right-10 md:top-1/2 md:h-10 md:w-10 md:-translate-y-1/2 md:text-[#1F3C88]/40" />
              )}
            </FadeInSection>
          );
        })}
      </div>
    </section>
  );
}

function MarketProofSection() {
  return (
    <section className="bg-white/80 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:px-8 lg:px-12">
        <FadeInSection className="self-center">
          <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#1F3C88] via-[#2847a4] to-[#2f9683] p-8 text-white shadow-[0_30px_100px_rgba(31,60,136,0.3)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-[#00BFA6]/30 blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.12] px-4 py-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4" />
                Momentum metrics
              </div>
              <p className="text-4xl font-extrabold leading-tight">
                +45% faster skill progression
              </p>
              <div className="flex items-end gap-4 pt-4">
                {[60, 85, 100].map((height, idx) => (
                  <div key={height} className="flex-1">
                    <div
                      className={cn(
                        "rounded-2xl bg-white/60",
                        idx === 2 ? "bg-white" : "",
                      )}
                      style={{ height: `${height}%` }}
                    />
                    <p className="mt-3 text-xs uppercase tracking-widest text-white/80">
                      Week {idx + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </FadeInSection>

        <FadeInSection delay={120} className="space-y-8">
          <div>
            <h2 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
              Proof that AI mentorship accelerates learning.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              From global studies to our early users — adaptive AI guidance
              improves completion rates and motivation.
            </p>
          </div>

          <ul className="space-y-4">
            {proofPoints.map((point) => (
              <li
                key={point.label}
                className="rounded-2xl border border-[#d6e4ff] bg-white/90 p-5 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-[#1F3C88]/70">
                  {point.label}
                </p>
                <p className="mt-2 text-base text-slate-600">{point.detail}</p>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-3 rounded-2xl border border-[#d6e4ff] bg-[#f8faff] p-5 shadow-sm">
            <Quote className="h-10 w-10 text-[#00BFA6]" />
            <div>
              <p className="text-lg font-medium text-slate-700">
                “Learning feels human — but supercharged.”
              </p>
              <p className="mt-1 text-sm text-slate-500">Beta User, Data Track</p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:px-8 lg:px-12">
      <FadeInSection className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
          Real voices. Real progress.
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          CareerWise sprints unlock clarity, consistency, and confidence —
          straight from the learners shaping their next chapter.
        </p>
      </FadeInSection>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <FadeInSection key={testimonial.name} delay={index * 100}>
            <Card className="flex h-full flex-col gap-5 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-md shadow-[#1f3c88]/5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`${testimonial.avatar}?auto=format&fit=crop&w=128&q=80`}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-base leading-7 text-slate-600">
                “{testimonial.quote}”
              </p>
            </Card>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-[#1F3C88] py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 text-center md:flex-row md:items-center md:justify-between md:px-8 md:text-left lg:px-12">
        <div className="mx-auto w-full max-w-xl space-y-4">
          <h3 className="text-3xl font-semibold">Join the waitlist today</h3>
          <p className="text-base text-white/80">
            Join 1,000+ learners shaping their future with CareerWise.
          </p>
          <form className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-16 w-full flex-1 rounded-full border border-white/20 bg-white/20 px-6 text-lg text-white placeholder:text-white/70 outline-none backdrop-blur-sm transition focus:border-[#FFD166] focus:bg-white/25 focus:ring-2 focus:ring-[#FFD166]/60 sm:h-14 sm:text-base"
            />
            <Button
              type="submit"
              className="h-16 w-full rounded-full bg-[#00BFA6] px-6 text-lg font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[#00a48f] sm:h-14 sm:w-auto sm:text-base"
            >
              Join
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Follow our journey
          </p>
          <div className="flex items-center justify-center gap-4">
            <SocialLink
              href="https://www.linkedin.com"
              label="LinkedIn"
              icon={Linkedin}
            />
            <SocialLink
              href="https://www.twitter.com"
              label="Twitter"
              icon={Twitter}
            />
            <SocialLink
              href="https://www.youtube.com"
              label="YouTube"
              icon={Youtube}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

type SocialLinkProps = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function SocialLink({ href, label, icon: Icon }: SocialLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:border-[#FFD166] hover:text-[#FFD166]"
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}
