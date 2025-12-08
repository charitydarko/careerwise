import type { Course, CareerProfile, User } from "@prisma/client";

type Difficulty = "beginner" | "intermediate" | "advanced";
type TaskType = "project" | "exercise" | "reading" | "reflection" | "quiz";

export type GeneratedTask = {
  id: string;
  title: string;
  summary: string;
  type: TaskType;
  difficulty: Difficulty;
  estimated_minutes: number;
  tags: string[];
  goal: string;
  instructions: string[];
  acceptance_criteria: string[];
  deliverables: string[];
  evaluation_rubric: {
    dimensions: Array<{ name: string; description: string; weight: number }>;
  };
  stretch_ideas: string[];
};

export type GeneratedCourseTasks = {
  course_name: string;
  tasks: GeneratedTask[];
};

type GenerationContext = {
  user: User & { profile: CareerProfile | null };
  targetRole: string;
  hoursPerWeek?: number;
};

const DEFAULT_MODULE = "core skill practice";

const BASE_MINUTES: Record<Difficulty, number> = {
  beginner: 45,
  intermediate: 75,
  advanced: 120,
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function pickEstimatedMinutes(level: Difficulty, type: TaskType, hoursPerWeek?: number) {
  const base = BASE_MINUTES[level] ?? 60;
  const factor =
    type === "project" ? 2.5 : type === "exercise" ? 1 : type === "reflection" ? 0.6 : 1.2;
  const raw = Math.round(base * factor);
  if (!hoursPerWeek) return raw;
  // Fit within weekly bandwidth (rough heuristic: 1/5 of weekly time per task on average)
  const target = Math.max(30, Math.min(raw, Math.round((hoursPerWeek * 60) / 5)));
  return target;
}

function ensureModules(modules: any): string[] {
  if (Array.isArray(modules)) {
    return modules.map((m) => (typeof m === "string" ? m : JSON.stringify(m))).filter(Boolean);
  }
  if (typeof modules === "string" && modules.trim()) {
    return modules.split("\n").map((m) => m.trim()).filter(Boolean);
  }
  return [DEFAULT_MODULE];
}

function buildRubric(level: Difficulty, type: TaskType) {
  const common = [
    { name: "Relevance", description: "Task output aligns with course topic and role focus", weight: 0.25 },
    { name: "Clarity", description: "Output is organized, easy to follow, and well-documented", weight: 0.2 },
  ];

  if (type === "reflection") {
    return {
      dimensions: [
        ...common,
        { name: "Insight", description: "Captures learnings, blockers, and next steps", weight: 0.35 },
        { name: "Actionability", description: "Identifies concrete adjustments to plan", weight: 0.2 },
      ],
    };
  }

  return {
    dimensions: [
      ...common,
      {
        name: "Technical quality",
        description: level === "beginner"
          ? "Meets basic functional requirements with clean structure"
          : "Meets requirements with sound architecture and error handling",
        weight: 0.35,
      },
      {
        name: "Testing/validation",
        description: "Evidence of testing, validation, or measurement of results",
        weight: 0.2,
      },
    ],
  };
}

function buildTask(
  courseName: string,
  moduleTopic: string,
  type: TaskType,
  difficulty: Difficulty,
  index: number,
  ctx: GenerationContext,
): GeneratedTask {
  const titlePrefix =
    type === "project" ? "Project" : type === "reflection" ? "Retro" : "Exercise";
  const id = `${slugify(courseName)}-${slugify(moduleTopic)}-task-${index + 1}`;
  const estimated_minutes = pickEstimatedMinutes(difficulty, type, ctx.hoursPerWeek);

  const summaryMap: Record<TaskType, string> = {
    exercise: `Hands-on practice focusing on ${moduleTopic}.`,
    project: `Build and ship a tangible artifact applying ${moduleTopic}.`,
    reflection: `Summarize learnings from working with ${moduleTopic}.`,
    reading: `Study notes on ${moduleTopic} and capture takeaways.`,
    quiz: `Check your understanding of ${moduleTopic}.`,
  };

  const goal = type === "project"
    ? `Create a small but realistic deliverable a ${ctx.targetRole} would show in a portfolio.`
    : `Reinforce ${moduleTopic} for ${ctx.targetRole} responsibilities.`;

  const instructions = (() => {
    if (type === "project") {
      return [
        `Define a user story relevant to ${ctx.targetRole} that uses ${moduleTopic}.`,
        `Implement the feature end-to-end in your primary stack where possible.`,
        "Add basic error handling and logging.",
        "Include a short README with setup, decisions, and trade-offs.",
      ];
    }
    if (type === "reflection") {
      return [
        `Write a 300-500 word retro on what you learned about ${moduleTopic}.`,
        "List blockers, how you debugged, and what you'd try next.",
        "Note one experiment to run in the next task to validate an improvement.",
      ];
    }
    return [
      `Build a focused example that uses ${moduleTopic} in your primary stack.`,
      "Keep scope small; aim to finish within the estimated time.",
      "Add one test or validation step to prove it works.",
    ];
  })();

  const acceptance_criteria = (() => {
    if (type === "project") {
      return [
        "Implements the defined user story with working functionality.",
        "Includes README with setup steps and decisions.",
        "Demonstrates handling of edge cases or errors.",
      ];
    }
    if (type === "reflection") {
      return [
        "Captures what was attempted and why.",
        "Identifies at least one concrete next step.",
        "Highlights a challenge and a mitigation plan.",
      ];
    }
    return [
        "Example runs without errors.",
        "Includes at least one validation (test, log, or manual check).",
        "Shows the target concept clearly in code.",
      ];
  })();

  const deliverables = (() => {
    if (type === "reflection") {
      return ["Retro note (doc or markdown) linked in your repo or notes."];
    }
    if (type === "project") {
      return [
        "Repository or sandbox link.",
        "README with setup and decisions.",
        "Screenshots or short loom/gif of the working feature.",
      ];
    }
    return ["Code snippet/repo plus a short note on what you validated."];
  })();

  const stretch_ideas =
    type === "project"
      ? [
          "Add automated tests or linting.",
          "Instrument basic metrics or logging.",
          "Refactor to improve readability or performance.",
        ]
      : [
          "Extend the example to cover an edge case.",
          "Add a short demo recording.",
          "Pair with a peer for feedback and notes.",
        ];

  return {
    id,
    title: `${titlePrefix}: ${moduleTopic}`,
    summary: summaryMap[type],
    type,
    difficulty,
    estimated_minutes,
    tags: [ctx.targetRole, courseName, moduleTopic].map((t) => t.toLowerCase()),
    goal,
    instructions,
    acceptance_criteria,
    deliverables,
    evaluation_rubric: buildRubric(difficulty, type),
    stretch_ideas,
  };
}

export function generateCourseTasks(
  course: Course,
  numTasks: number,
  ctx: GenerationContext,
): GeneratedCourseTasks {
  const modules = ensureModules(course.modules);
  const level = (ctx.user.profile?.learningLevel?.toLowerCase() as Difficulty) || "beginner";

  // Guarantee at least one exercise, one project, one reflection
  const taskTypes: TaskType[] = ["exercise", "project", "reflection"];
  while (taskTypes.length < numTasks) {
    taskTypes.push("exercise");
  }

  const tasks = taskTypes.slice(0, numTasks).map((type, index) => {
    const moduleTopic = modules[index % modules.length] || DEFAULT_MODULE;
    return buildTask(course.name, moduleTopic, type, level, index, ctx);
  });

  return { course_name: course.name, tasks };
}
