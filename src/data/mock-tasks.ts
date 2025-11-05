export type ResourceType = "article" | "code" | "video" | "canvas";

export type Task = {
  id: string;
  title: string;
  description: string;
  difficulty: "starter" | "focus" | "deep";
  estimatedMinutes: number;
  due: string;
  mentorTip: string;
  resource: {
    type: ResourceType;
    title: string;
    description: string;
    url: string;
    embed: string;
  };
  checklist: string[];
};

export const mockTasks: Record<string, Task> = {
  "insight-brief": {
    id: "insight-brief",
    title: "Design data story outline",
    description:
      "Draft the narrative arc for tomorrow’s stakeholder sync. Focus on framing the retention insight discovered yesterday.",
    difficulty: "focus",
    estimatedMinutes: 35,
    due: "Today · 5:00 PM",
    mentorTip:
      "Anchor your story in user outcome, then show the metric movement. Bring one chart that highlights change over time.",
    resource: {
      type: "article",
      title: "Product Analytics Narrative Framework",
      description:
        "A short read walking through the three-act storytelling structure for analytics updates.",
      url: "https://example.com/analytics-narrative",
      embed: "https://example.com/embed/narrative-framework",
    },
    checklist: [
      "Identify the key user moment your insight affects.",
      "Map the before/after metric change using a simple chart.",
      "Draft a closing recommendation with next-step experiment.",
    ],
  },
  "sql-retention": {
    id: "sql-retention",
    title: "Segment retention cohorts",
    description:
      "Use the provided SQL snippet to calculate Week 4 retention rate by cohort. Capture screenshots of the top three segments.",
    difficulty: "deep",
    estimatedMinutes: 45,
    due: "Tomorrow · 9:00 AM",
    mentorTip:
      "Keep your cohorts bucketed by signup source. Share the highest performing segment in voice chat for tailored prompts.",
    resource: {
      type: "code",
      title: "Retention Cohort SQL Template",
      description:
        "Pre-built query covering weekly retention, ready to run in your warehouse. Swap the `event_logs` table name if needed.",
      url: "https://example.com/sql-template",
      embed: "https://gist.github.com/sample",
    },
    checklist: [
      "Run the cohort query in staging.",
      "Export results to CSV and add to the sprint doc.",
      "Highlight the top cohort in your async update.",
    ],
  },
  "async-update": {
    id: "async-update",
    title: "Record async mentor update",
    description:
      "Film a 2-minute Loom sharing today’s progress, key metrics, and blocker requests.",
    difficulty: "starter",
    estimatedMinutes: 20,
    due: "Today · 7:00 PM",
    mentorTip:
      "Keep it simple: Progress, metrics, blockers. I’ll respond with tailored prompts overnight.",
    resource: {
      type: "video",
      title: "Async Update Blueprint",
      description:
        "Short walkthrough showing how to structure voice/video updates for fast mentor feedback.",
      url: "https://example.com/async-update-blueprint",
      embed: "https://player.vimeo.com/video/123456",
    },
    checklist: [
      "Outline progress, metrics, and blockers.",
      "Record Loom or audio clip.",
      "Share link in mentor channel.",
    ],
  },
};

export type TaskId = keyof typeof mockTasks;

export const difficultyMeta: Record<
  Task["difficulty"],
  { label: string; tone: string }
> = {
  starter: { label: "Starter", tone: "bg-[#ecfdf9] text-[#007864]" },
  focus: { label: "Focus", tone: "bg-[#e0f2fe] text-[#1F3C88]" },
  deep: { label: "Deep Work", tone: "bg-[#fef3c7] text-[#b45309]" },
};
