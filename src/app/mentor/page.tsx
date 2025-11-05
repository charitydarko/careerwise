"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  ArrowLeft,
  AudioLines,
  Download,
  Headphones,
  History,
  MessageCircle,
  Mic,
  PauseCircle,
  PlayCircle,
  Send,
  Waves,
} from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type VoiceInteraction = {
  id: string;
  createdAt: string;
  mode: "chat" | "voice";
  durationSeconds: number;
  summary: string;
  transcript: string;
  aiInsights: string[];
};

type MentorTab = "chat" | "voice" | "history";

type LLMEvent = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
};

const mockInteractions: VoiceInteraction[] = [
  {
    id: "int-1",
    createdAt: "2024-11-04T16:20:00.000Z",
    mode: "voice",
    durationSeconds: 132,
    summary: "Clarified KPI definition and suggested focusing on retention drivers.",
    transcript:
      "User: I’m struggling to define the win metric for our activation test.\nCareerWise: Let’s anchor on retention and work back. Try the Day 7 retained rate and run a cohort breakdown.\nUser: Great, I’ll pull that today.\nCareerWise: I’ll add prompts to guide that analysis.",
    aiInsights: [
      "Shifted activation KPI from sign-ups to retained usage.",
      "Prompted cohort analysis with provided SQL scaffold.",
    ],
  },
  {
    id: "int-2",
    createdAt: "2024-11-02T10:05:00.000Z",
    mode: "chat",
    durationSeconds: 58,
    summary:
      "Shared async update about stakeholder narrative; AI recommended story arc template.",
    transcript:
      "User: Drafted slides but struggling with flow.\nCareerWise: Use the 3-act data story template. I’ll attach your previous win summary for reference.",
    aiInsights: [
      "Recommended narrative arc resource.",
      "Logged follow-up task to review slides tomorrow.",
    ],
  },
];

const mockEvents: LLMEvent[] = [
  {
    id: "event-1",
    role: "assistant",
    content:
      "Hey, I’m tuned in. Share a quick update or start recording and I’ll steer you.",
    timestamp: new Date().toISOString(),
  },
];

export default function VoiceMentorPage() {
  const searchParams = useSearchParams();
  const getValidTab = (value: string | null): MentorTab => {
    if (value === "voice" || value === "history") {
      return value;
    }
    return "chat";
  };

  const tabParam = searchParams.get("tab");
  const tabFromParams = useMemo(() => getValidTab(tabParam), [tabParam]);
  const [tabOverride, setTabOverride] = useState<MentorTab | null>(null);
  const tab = tabOverride ?? tabFromParams;
  const [events, setEvents] = useState<LLMEvent[]>(mockEvents);
  const [chatInput, setChatInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeInteractionId, setActiveInteractionId] = useState<string | null>(
    mockInteractions[0]?.id ?? null,
  );

  const activeInteraction = useMemo(
    () =>
      mockInteractions.find((interaction) => interaction.id === activeInteractionId) ??
      mockInteractions[0],
    [activeInteractionId],
  );

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) {
      return;
    }
    const now = new Date().toISOString();
    setEvents((prev) => [
      ...prev,
      {
        id: `user-${prev.length + 1}`,
        role: "user",
        content: chatInput.trim(),
        timestamp: now,
      },
      {
        id: `assistant-${prev.length + 2}`,
        role: "assistant",
        content:
          "Thanks for the update! I’ll queue a follow-up prompt and share resources shortly.",
        timestamp: new Date().toISOString(),
      },
    ]);
    setChatInput("");
  };

  return (
    <main className="min-h-screen bg-[#f3f6ff] pb-16 pt-12 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 lg:px-10">
        <header className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur md:p-8">
          <div className="mb-6 flex justify-start">
            <Button
              variant="ghost"
              asChild
              className="inline-flex items-center gap-2 rounded-full bg-[#f1f5ff] px-4 py-2 text-sm font-semibold text-[#1F3C88] hover:bg-[#e4ebff]"
            >
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e0f2fe] px-4 py-2 text-sm font-semibold text-[#1F3C88]">
                <Waves className="h-4 w-4" />
                Voice Mentor
              </div>
              <h1 className="text-3xl font-semibold text-[#1F3C88] md:text-4xl">
                Your realtime coach & accountability partner
              </h1>
              <p className="text-base text-slate-600">
                Share blockers, insights, or wins—CareerWise replies instantly with tailored prompts.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Badge variant="outline" className="border-[#1F3C88]/20 text-[#1F3C88]">
                <Headphones className="mr-1 h-4 w-4 text-[#00BFA6]" />
                Live sync available
              </Badge>
              <Button className="h-12 rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-md hover:bg-[#00a48f]">
                Schedule mentor slot
              </Button>
            </div>
          </div>
        </header>

        <Tabs
          value={tab}
          onValueChange={(value) => setTabOverride(value as MentorTab)}
        >
          <TabsList className="flex w-full flex-col gap-3 rounded-3xl border border-white/70 bg-white/90 p-3 shadow-md md:flex-row md:gap-2 md:p-2">
            <TabsTrigger
              value="chat"
              className="flex-1 rounded-2xl px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="flex-1 rounded-2xl px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              Voice
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 rounded-2xl px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <ChatView
              events={events}
              chatInput={chatInput}
              onChatInputChange={setChatInput}
              onSend={handleSendChat}
            />
          </TabsContent>

          <TabsContent value="voice" className="mt-6">
            <VoiceView
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              lastInteraction={mockInteractions[0]}
            />
          </TabsContent>

  <TabsContent value="history" className="mt-6">
    <HistoryView
      interactions={mockInteractions}
      activeId={activeInteraction?.id ?? null}
      activeInteraction={activeInteraction ?? null}
      onSelect={setActiveInteractionId}
    />
  </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

type ChatViewProps = {
  events: LLMEvent[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSend: () => void;
};

function ChatView({
  events,
  chatInput,
  onChatInputChange,
  onSend,
}: ChatViewProps) {
  return (
    <FadeInSection className="grid gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1F3C88]">Live chat</h2>
          <Badge variant="outline" className="border-[#00BFA6]/30 text-[#00BFA6]">
            <MessageCircle className="mr-1 h-3.5 w-3.5" />
            Streaming
          </Badge>
        </div>
        <ScrollArea className="h-[320px] rounded-3xl border border-slate-200/70 bg-white/70 p-5">
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-6 shadow transition",
                  event.role === "assistant"
                    ? "bg-[#ecfdf9] text-[#007864]"
                    : "ml-auto bg-[#1F3C88] text-white",
                )}
              >
                {event.content}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/90 p-3">
          <Input
            value={chatInput}
            onChange={(event) => onChatInputChange(event.target.value)}
            placeholder="Type an update or ask for a recommendation…"
            className="flex-1 border-none bg-transparent text-sm focus-visible:ring-0"
          />
          <Button
            onClick={onSend}
            disabled={!chatInput.trim()}
            className="h-11 rounded-full bg-[#00BFA6] px-4 text-sm font-semibold text-white transition hover:bg-[#00a48f] disabled:bg-[#00BFA6]/40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-[#f6f9ff] p-5">
        <h3 className="text-lg font-semibold text-[#1F3C88]">
          Transcript stream
        </h3>
        <Textarea
          value={events
            .map(
              (event) =>
                `${event.role === "assistant" ? "CareerWise" : "You"}: ${event.content}`,
            )
            .join("\n\n")}
          readOnly
          className="min-h-[280px] resize-none rounded-2xl border border-slate-200 bg-white/80 text-sm text-slate-600 focus-visible:ring-0"
        />
        <Button variant="ghost" className="self-start text-sm text-[#1F3C88]">
          Download transcript
        </Button>
      </div>
    </FadeInSection>
  );
}

type VoiceViewProps = {
  isRecording: boolean;
  toggleRecording: () => void;
  lastInteraction: VoiceInteraction;
};

function VoiceView({
  isRecording,
  toggleRecording,
  lastInteraction,
}: VoiceViewProps) {
  return (
    <FadeInSection className="grid gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-[#00BFA6]/30 bg-[#ecfdf9] px-6 py-10 text-center">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#007864]">
            <Mic className="h-5 w-5" />
            <span>{isRecording ? "Recording…" : "Ready for mic"}</span>
          </div>
          <div className="mt-8 flex h-24 w-full max-w-md items-end justify-between gap-2">
            {Array.from({ length: 32 }).map((_, index) => (
              <span
                key={index}
                className="audio-bar w-2 rounded-full bg-[#00BFA6]"
                style={{
                  animationDelay: `${index * 0.04}s`,
                  animationDuration: isRecording ? "1.2s" : "2s",
                  opacity: isRecording ? 1 : 0.4,
                }}
              />
            ))}
          </div>
          <Button
            onClick={toggleRecording}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#00BFA6] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#00a48f]"
          >
            {isRecording ? (
              <>
                <PauseCircle className="h-5 w-5" />
                Stop recording
              </>
            ) : (
              <>
                <PlayCircle className="h-5 w-5" />
                Start voice session
              </>
            )}
          </Button>
          <p className="mt-3 text-sm text-[#007864]/80">
            Auto-save generates a transcript and adds prompts to your sprint.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-[#f6f9ff] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1F3C88]">
            Latest session
          </h3>
          <Badge variant="outline" className="border-[#1F3C88]/20 text-[#1F3C88]">
            {formatDistanceToNow(parseISO(lastInteraction.createdAt), {
              addSuffix: true,
            })}
          </Badge>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
          <p className="text-sm text-slate-500">{lastInteraction.summary}</p>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            <span className="inline-flex items-center gap-2 text-[#007864]">
              <AudioLines className="h-4 w-4" />
              {Math.round(lastInteraction.durationSeconds / 60)}m
            </span>
            <Button variant="link" className="px-0 text-[#1F3C88]">
              View transcript
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            AI insights
          </h4>
          <ul className="space-y-2">
            {lastInteraction.aiInsights.map((insight, index) => (
              <li
                key={insight}
                className="flex items-start gap-3 rounded-2xl border border-[#00BFA6]/20 bg-white/90 p-4 text-sm text-[#1F3C88]"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ecfdf9] text-xs font-semibold text-[#007864]">
                  {index + 1}
                </span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
        <Button variant="ghost" className="self-start text-sm text-[#1F3C88]">
          <Download className="mr-2 h-4 w-4" />
          Export audio & transcript
        </Button>
      </div>
    </FadeInSection>
  );
}

type HistoryViewProps = {
  interactions: VoiceInteraction[];
  activeId: string | null;
  activeInteraction: VoiceInteraction | null;
  onSelect: (id: string) => void;
};

function HistoryView({
  interactions,
  activeId,
  activeInteraction,
  onSelect,
}: HistoryViewProps) {
  return (
    <FadeInSection className="grid gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1F3C88]">
            Interaction history
          </h2>
          <Badge variant="outline" className="border-[#00BFA6]/30 text-[#00BFA6]">
            <History className="mr-1 h-3.5 w-3.5" />
            {interactions.length} sessions
          </Badge>
        </div>
        <ScrollArea className="h-[360px] rounded-3xl border border-slate-200/70 bg-white/70">
          <div className="divide-y divide-slate-200/80">
            {interactions.map((interaction) => (
              <button
                key={interaction.id}
                type="button"
                onClick={() => onSelect(interaction.id)}
                className={cn(
                  "flex w-full flex-col gap-2 px-5 py-4 text-left transition hover:bg-[#e4ebff]",
                  activeId === interaction.id && "bg-[#1F3C88] text-white",
                )}
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                  <span>
                    {formatDistanceToNow(parseISO(interaction.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold">
                    {interaction.mode === "voice" ? (
                      <>
                        <Mic className="h-4 w-4" />
                        Voice
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {interaction.summary}
                </p>
                <p className="text-xs text-slate-500">
                  Duration: {Math.round(interaction.durationSeconds / 60)}m
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="space-y-4 rounded-3xl border border-slate-200/60 bg-[#f6f9ff] p-5">
        {activeId && activeInteraction ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1F3C88]">
                Session details
              </h3>
              <Badge variant="outline" className="border-[#1F3C88]/20 text-[#1F3C88]">
                {Math.round((activeInteraction.durationSeconds ?? 0) / 60)} min
              </Badge>
            </div>
            <Textarea
              readOnly
              value={activeInteraction.transcript ?? ""}
              className="min-h-[260px] resize-none rounded-2xl border border-slate-200 bg-white/90 text-sm text-slate-600 focus-visible:ring-0"
            />
            <Button variant="ghost" className="self-start text-sm text-[#1F3C88]">
              Download session
            </Button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500">
            Select a session to review its transcript and AI notes.
          </div>
        )}
      </div>
    </FadeInSection>
  );
}
