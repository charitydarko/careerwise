export type LearningResource = {
  id: string;
  title: string;
  type: "article" | "video" | "toolkit" | "template";
  url: string;
  description: string;
  tags: string[];
  estimatedMinutes: number;
};

export type AgentPromptTemplate = {
  id: string;
  name: string;
  useCase: "check-in" | "insight" | "productivity" | "celebration";
  temperature: number;
  systemPrompt: string;
  sampleInput: string;
};

export type PlanVersionSummary = {
  id: string;
  label: string;
  focusTrack: string;
  sprintLength: number;
  totalTasks: number;
  deepWorkMinutes: number;
  voicePrompts: number;
  changes: string[];
  highlights: string[];
};

export const initialLearningResources: LearningResource[] = [
  {
    id: "res-analytics-story",
    title: "Product Analytics Narrative Framework",
    type: "article",
    url: "https://example.com/analytics-narrative",
    description:
      "Guide on framing data stories for executive stakeholders with examples.",
    tags: ["storytelling", "analytics"],
    estimatedMinutes: 12,
  },
  {
    id: "res-cohort-sql",
    title: "Retention Cohort SQL Template",
    type: "template",
    url: "https://example.com/sql-template",
    description:
      "Ready-to-run SQL snippet for weekly retention and cohort analysis.",
    tags: ["sql", "retention"],
    estimatedMinutes: 8,
  },
];

export const initialAgentPrompts: AgentPromptTemplate[] = [
  {
    id: "prompt-checkin",
    name: "Daily check-in coach",
    useCase: "check-in",
    temperature: 0.4,
    systemPrompt:
      "You are CareerWise, a pragmatic mentor. Ask the learner about blockers, wins, and what they plan next.",
    sampleInput:
      "We finished the cohort query but I'm stuck on how to present the findings tomorrow.",
  },
  {
    id: "prompt-insight",
    name: "Insight synthesizer",
    useCase: "insight",
    temperature: 0.6,
    systemPrompt:
      "Summarise the learner's insight, connect it to sprint goals, and offer one follow-up question.",
    sampleInput:
      "Retention for the onboarding revision hit 62%, but activation touchpoints are still inconsistent.",
  },
];

export const planVersions: PlanVersionSummary[] = [
  {
    id: "pv-v3",
    label: "Data Sprint · v3",
    focusTrack: "Data Science",
    sprintLength: 14,
    totalTasks: 28,
    deepWorkMinutes: 560,
    voicePrompts: 6,
    changes: [
      "Replaced Day 6 task with narrative outline workshop.",
      "Added async mentor update on Day 9.",
    ],
    highlights: [
      "Average completion rate 92%",
      "+8% uplift in deep work minutes vs v2",
    ],
  },
  {
    id: "pv-v2",
    label: "Data Sprint · v2",
    focusTrack: "Data Science",
    sprintLength: 14,
    totalTasks: 26,
    deepWorkMinutes: 510,
    voicePrompts: 4,
    changes: [
      "Original Day 6 retained SQL deep dive.",
      "No async mentor update for Day 9.",
    ],
    highlights: ["Completion rate 84%", "Learners requested more narrative support"],
  },
  {
    id: "pv-fe-v1",
    label: "Frontend Sprint · v1",
    focusTrack: "Frontend Development",
    sprintLength: 10,
    totalTasks: 20,
    deepWorkMinutes: 420,
    voicePrompts: 3,
    changes: [
      "Heavier focus on component systems in first week.",
      "Reduced async updates to 2 per week.",
    ],
    highlights: [
      "Completion rate 88%",
      "Average time-to-ship decreased by 2.1 days",
    ],
  },
];
