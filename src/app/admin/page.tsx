"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardPen,
  LayoutDashboard,
  Scale,
  Trash2,
} from "lucide-react";

import { FadeInSection } from "@/components/fade-in-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  type AgentPromptTemplate,
  type LearningResource,
  initialAgentPrompts,
  initialLearningResources,
  planVersions,
} from "@/data/mock-admin";
import { cn } from "@/lib/utils";

const resourceTypes: LearningResource["type"][] = [
  "article",
  "video",
  "toolkit",
  "template",
];

const promptUseCases: AgentPromptTemplate["useCase"][] = [
  "check-in",
  "insight",
  "productivity",
  "celebration",
];

export default function AdminPage() {
  const [resources, setResources] = useState(initialLearningResources);
  const [resourceForm, setResourceForm] = useState<Omit<LearningResource, "id">>({
    title: "",
    type: "article",
    url: "",
    description: "",
    tags: [],
    estimatedMinutes: 10,
  });
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  const [prompts, setPrompts] = useState(initialAgentPrompts);
  const [promptForm, setPromptForm] = useState<Omit<AgentPromptTemplate, "id">>({
    name: "",
    useCase: "check-in",
    temperature: 0.5,
    systemPrompt: "",
    sampleInput: "",
  });
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);

  const [primaryPlanId, setPrimaryPlanId] = useState(planVersions[0].id);
  const [comparisonPlanId, setComparisonPlanId] = useState(planVersions[1].id);

  const primaryPlan = useMemo(
    () => planVersions.find((plan) => plan.id === primaryPlanId) ?? planVersions[0],
    [primaryPlanId],
  );
  const comparisonPlan = useMemo(
    () =>
      planVersions.find((plan) => plan.id === comparisonPlanId) ?? planVersions[1],
    [comparisonPlanId],
  );

  const metricDiff = useMemo(() => {
    if (!primaryPlan || !comparisonPlan) {
      return null;
    }
    return {
      tasks: primaryPlan.totalTasks - comparisonPlan.totalTasks,
      deepWork: primaryPlan.deepWorkMinutes - comparisonPlan.deepWorkMinutes,
      voice: primaryPlan.voicePrompts - comparisonPlan.voicePrompts,
      length: primaryPlan.sprintLength - comparisonPlan.sprintLength,
    };
  }, [primaryPlan, comparisonPlan]);

  const resetResourceForm = () => {
    setResourceForm({
      title: "",
      type: "article",
      url: "",
      description: "",
      tags: [],
      estimatedMinutes: 10,
    });
    setEditingResourceId(null);
  };

  const resetPromptForm = () => {
    setPromptForm({
      name: "",
      useCase: "check-in",
      temperature: 0.5,
      systemPrompt: "",
      sampleInput: "",
    });
    setEditingPromptId(null);
  };

  const handleResourceSubmit = () => {
    if (!resourceForm.title.trim()) {
      return;
    }

    if (editingResourceId) {
      setResources((prev) =>
        prev.map((resource) =>
          resource.id === editingResourceId
            ? {
                id: resource.id,
                ...resourceForm,
                tags: resourceForm.tags.map((tag) => tag.trim()).filter(Boolean),
              }
            : resource,
        ),
      );
    } else {
      setResources((prev) => [
        ...prev,
        {
          id: `res-${Date.now()}`,
          ...resourceForm,
          tags: resourceForm.tags.map((tag) => tag.trim()).filter(Boolean),
        },
      ]);
    }
    resetResourceForm();
  };

  const handlePromptSubmit = () => {
    if (!promptForm.name.trim() || !promptForm.systemPrompt.trim()) {
      return;
    }

    if (editingPromptId) {
      setPrompts((prev) =>
        prev.map((prompt) =>
          prompt.id === editingPromptId
            ? { id: prompt.id, ...promptForm }
            : prompt,
        ),
      );
    } else {
      setPrompts((prev) => [
        ...prev,
        {
          id: `prompt-${Date.now()}`,
          ...promptForm,
        },
      ]);
    }
    resetPromptForm();
  };

  return (
    <main className="min-h-screen bg-[#f3f6ff] pb-20 pt-12 font-[family:var(--font-inter)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:px-10">
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
                Admin & Creator Tools
              </h1>
              <p className="text-base text-slate-600">
                Manage your learning resources, agent prompt templates, and compare plan versions before publishing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              <span className="inline-flex items-center gap-2 text-[#00BFA6]">
                <LayoutDashboard className="h-4 w-4" />
                {resources.length} resources
              </span>
              <span className="inline-flex items-center gap-2 text-[#1F3C88]">
                <ClipboardPen className="h-4 w-4" />
                {prompts.length} prompts
              </span>
              <span className="inline-flex items-center gap-2 text-[#FFD166]">
                <Scale className="h-4 w-4" />
                {planVersions.length} plan versions
              </span>
            </div>
          </div>
          <Button className="h-12 rounded-full bg-[#00BFA6] px-6 text-base font-semibold text-white shadow-lg shadow-[#00BFA6]/30 transition hover:bg-[#00a48f]">
            Publish updates
          </Button>
        </header>

        <Tabs defaultValue="resources" className="space-y-8">
          <TabsList className="flex flex-wrap gap-3 rounded-3xl border border-white/70 bg-white/90 p-2 shadow-md">
            <TabsTrigger
              value="resources"
              className="flex-1 rounded-2xl px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              Learning resources
            </TabsTrigger>
            <TabsTrigger
              value="prompts"
              className="flex-1 rounded-2xl px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              Agent prompts
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="flex-1 rounded-2xl px-6 py-3 text-sm font-semibold text-slate-500 data-[state=active]:bg-[#1F3C88] data-[state=active]:text-white"
            >
              Plan comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-8">
            <FadeInSection className="grid gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:p-8">
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-[#1F3C88]">
                  Resource catalogue
                </h2>
                <ScrollArea className="h-[460px] pr-3">
                  <div className="flex flex-col gap-4">
                    {resources.map((resource) => (
                      <Card
                        key={resource.id}
                        className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold text-[#1F3C88]">
                              {resource.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              {resource.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {resource.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                          <span>{resource.estimatedMinutes} minutes</span>
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            asChild
                            variant="ghost"
                            className="px-0 text-sm font-semibold text-[#1F3C88] hover:text-[#153070]"
                          >
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open resource
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                          <div className="ml-auto flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingResourceId(resource.id);
                                setResourceForm({
                                  title: resource.title,
                                  description: resource.description,
                                  estimatedMinutes: resource.estimatedMinutes,
                                  type: resource.type,
                                  url: resource.url,
                                  tags: resource.tags,
                                });
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() =>
                                setResources((prev) =>
                                  prev.filter((item) => item.id !== resource.id),
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {resources.length === 0 && (
                      <Card className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
                        No resources yet. Add one using the creator form.
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </div>
              <div className="space-y-5 rounded-3xl border border-slate-200/70 bg-[#f6f9ff] p-6">
                <h3 className="text-lg font-semibold text-[#1F3C88]">
                  {editingResourceId ? "Update resource" : "Add new resource"}
                </h3>
                <div className="space-y-4">
                  <Input
                    value={resourceForm.title}
                    onChange={(event) =>
                      setResourceForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    placeholder="Resource title"
                  />
                  <Textarea
                    value={resourceForm.description}
                    onChange={(event) =>
                      setResourceForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Short description"
                    className="min-h-[100px]"
                  />
                  <Input
                    value={resourceForm.url}
                    onChange={(event) =>
                      setResourceForm((prev) => ({ ...prev, url: event.target.value }))
                    }
                    placeholder="Resource URL"
                  />
                  <Select
                    value={resourceForm.type}
                    onValueChange={(value) =>
                      setResourceForm((prev) => ({
                        ...prev,
                        type: value as LearningResource["type"],
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    value={resourceForm.estimatedMinutes}
                    onChange={(event) =>
                      setResourceForm((prev) => ({
                        ...prev,
                        estimatedMinutes: Number(event.target.value) || 0,
                      }))
                    }
                    placeholder="Estimated minutes"
                  />
                  <Input
                    value={resourceForm.tags.join(", ")}
                    onChange={(event) =>
                      setResourceForm((prev) => ({
                        ...prev,
                        tags: event.target.value.split(","),
                      }))
                    }
                    placeholder="Tags (comma separated)"
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 rounded-full bg-[#00BFA6] text-white hover:bg-[#00a48f]" onClick={handleResourceSubmit}>
                    {editingResourceId ? "Save changes" : "Add resource"}
                  </Button>
                  <Button variant="ghost" onClick={resetResourceForm}>
                    Clear
                  </Button>
                </div>
              </div>
            </FadeInSection>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-8">
            <FadeInSection className="grid gap-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:p-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#1F3C88]">
                  Agent prompt templates
                </h2>
                <ScrollArea className="h-[460px] pr-3">
                  <div className="space-y-4">
                    {prompts.map((prompt) => (
                      <Card
                        key={prompt.id}
                        className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-[#1F3C88]">
                              {prompt.name}
                            </p>
                            <Badge variant="outline" className="mt-1 capitalize">
                              {prompt.useCase} flow
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Temperature {prompt.temperature.toFixed(1)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            System prompt
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            {prompt.systemPrompt}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Sample input
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            “{prompt.sampleInput}”
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingPromptId(prompt.id);
                              setPromptForm({
                                name: prompt.name,
                                useCase: prompt.useCase,
                                temperature: prompt.temperature,
                                systemPrompt: prompt.systemPrompt,
                                sampleInput: prompt.sampleInput,
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              setPrompts((prev) =>
                                prev.filter((item) => item.id !== prompt.id),
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {prompts.length === 0 && (
                      <Card className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
                        No templates configured. Use the creator form to add one.
                      </Card>
                    )}
                  </div>
                </ScrollArea>
              </div>
              <div className="space-y-5 rounded-3xl border border-slate-200/70 bg-[#f6f9ff] p-6">
                <h3 className="text-lg font-semibold text-[#1F3C88]">
                  {editingPromptId ? "Update prompt" : "Add new prompt"}
                </h3>
                <div className="space-y-4">
                  <Input
                    value={promptForm.name}
                    onChange={(event) =>
                      setPromptForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Prompt name"
                  />
                  <Select
                    value={promptForm.useCase}
                    onValueChange={(value) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        useCase: value as AgentPromptTemplate["useCase"],
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Use case" />
                    </SelectTrigger>
                    <SelectContent>
                      {promptUseCases.map((useCase) => (
                        <SelectItem key={useCase} value={useCase}>
                          {useCase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={promptForm.temperature}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        temperature: Number(event.target.value),
                      }))
                    }
                    placeholder="Temperature"
                  />
                  <Textarea
                    value={promptForm.systemPrompt}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        systemPrompt: event.target.value,
                      }))
                    }
                    placeholder="System prompt instructions"
                    className="min-h-[120px]"
                  />
                  <Textarea
                    value={promptForm.sampleInput}
                    onChange={(event) =>
                      setPromptForm((prev) => ({
                        ...prev,
                        sampleInput: event.target.value,
                      }))
                    }
                    placeholder="Sample user input"
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 rounded-full bg-[#00BFA6] text-white hover:bg-[#00a48f]" onClick={handlePromptSubmit}>
                    {editingPromptId ? "Save prompt" : "Add prompt"}
                  </Button>
                  <Button variant="ghost" onClick={resetPromptForm}>
                    Clear
                  </Button>
                </div>
              </div>
            </FadeInSection>
          </TabsContent>

          <TabsContent value="plans" className="space-y-8">
            <FadeInSection className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_18px_80px_rgba(31,60,136,0.12)] backdrop-blur lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#1F3C88]">
                    Plan version comparison
                  </h2>
                  <p className="text-sm text-slate-500">
                    Review metrics and highlights to decide which version to publish.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Select value={primaryPlanId} onValueChange={setPrimaryPlanId}>
                    <SelectTrigger className="h-12 min-w-[220px] rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Select primary plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {planVersions.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={comparisonPlanId} onValueChange={setComparisonPlanId}>
                    <SelectTrigger className="h-12 min-w-[220px] rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Select comparison" />
                    </SelectTrigger>
                    <SelectContent>
                      {planVersions
                        .filter((plan) => plan.id !== primaryPlanId)
                        .map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <PlanSummaryCard plan={primaryPlan} highlight title="Primary plan" />
                <PlanSummaryCard plan={comparisonPlan} title="Comparison plan" />
              </div>

              {metricDiff && (
                <div className="mt-6 rounded-3xl border border-[#00BFA6]/30 bg-[#ecfdf9] p-6">
                  <h3 className="text-lg font-semibold text-[#007864]">
                    Difference snapshot
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DiffMetric label="Total tasks" value={metricDiff.tasks} />
                    <DiffMetric label="Deep work minutes" value={metricDiff.deepWork} />
                    <DiffMetric label="Voice prompts" value={metricDiff.voice} />
                    <DiffMetric label="Sprint length" value={metricDiff.length} />
                  </div>
                </div>
              )}
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <ComparisonList
                  title="Primary plan highlights"
                  items={primaryPlan?.highlights ?? []}
                />
                <ComparisonList
                  title="Primary plan changes"
                  items={primaryPlan?.changes ?? []}
                />
              </div>
            </FadeInSection>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function PlanSummaryCard({
  plan,
  title,
  highlight,
}: {
  plan: (typeof planVersions)[number] | undefined;
  title: string;
  highlight?: boolean;
}) {
  if (!plan) {
    return null;
  }
  return (
    <Card
      className={cn(
        "rounded-3xl border p-6",
        highlight ? "border-[#00BFA6]/40 bg-[#ecfdf9]" : "border-slate-200/60 bg-white/90",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
        {title}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-[#1F3C88]">{plan.label}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SummaryStat label="Focus track" value={plan.focusTrack} />
        <SummaryStat label="Sprint length" value={`${plan.sprintLength} days`} />
        <SummaryStat label="Total tasks" value={plan.totalTasks} />
        <SummaryStat label="Deep work" value={`${plan.deepWorkMinutes} mins`} />
        <SummaryStat label="Voice prompts" value={plan.voicePrompts} />
      </div>
    </Card>
  );
}

function SummaryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[#1F3C88]">{value}</p>
    </div>
  );
}

function DiffMetric({ label, value }: { label: string; value: number }) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const formattedValue = `${sign}${Math.abs(value)}`;

  return (
    <div className="rounded-2xl border border-[#007864]/20 bg-white/90 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#007864]/70">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-lg font-semibold",
          value >= 0 ? "text-[#007864]" : "text-[#b91c1c]",
        )}
      >
        {formattedValue}
      </p>
    </div>
  );
}

function ComparisonList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="rounded-3xl border border-slate-200/60 bg-white/90 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 inline-flex size-2 rounded-full bg-[#00BFA6]" />
            {item}
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-slate-400">No entries yet.</li>
        )}
      </ul>
    </Card>
  );
}
