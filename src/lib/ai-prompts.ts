/**
 * AI Prompt Templates and Context Management
 * 
 * Centralized prompt templates for all AI interactions.
 * Ensures consistent, high-quality responses from Gemini.
 */

import type {
  CareerTrack,
  LearningLevel,
  LearningPhase,
  ConversationContext,
  ConversationMessage,
} from "@/types/ai";

// ============================================================================
// Career Track Metadata
// ============================================================================

export const CAREER_TRACK_INFO: Record<CareerTrack, {
  fullName: string;
  description: string;
  coreSkills: string[];
  commonTools: string[];
}> = {
  frontend: {
    fullName: "Frontend Development",
    description: "Building user interfaces and web experiences",
    coreSkills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Responsive Design"],
    commonTools: ["VS Code", "Chrome DevTools", "Git", "npm", "Figma"],
  },
  data: {
    fullName: "Data Science & Analytics",
    description: "Analyzing data to drive insights and decisions",
    coreSkills: ["Python", "SQL", "Statistics", "Data Visualization", "Machine Learning"],
    commonTools: ["Jupyter", "Pandas", "SQL", "Tableau", "Excel"],
  },
  cloud: {
    fullName: "Cloud & DevOps",
    description: "Deploying and managing scalable infrastructure",
    coreSkills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud Platforms"],
    commonTools: ["AWS/GCP/Azure", "Terraform", "Jenkins", "Git", "Monitoring Tools"],
  },
  ux: {
    fullName: "UX/UI Design",
    description: "Creating intuitive and beautiful user experiences",
    coreSkills: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    commonTools: ["Figma", "Sketch", "Adobe XD", "InVision", "Miro"],
  },
  backend: {
    fullName: "Backend Development",
    description: "Building server-side applications and APIs",
    coreSkills: ["Node.js", "Databases", "API Design", "Authentication", "System Architecture"],
    commonTools: ["VS Code", "Postman", "Docker", "Git", "Database Clients"],
  },
};

// ============================================================================
// Mentor Persona Definitions
// ============================================================================

export const MENTOR_PERSONAS: Record<CareerTrack, {
  name: string;
  personality: string;
  greeting: string;
}> = {
  frontend: {
    name: "Alex",
    personality: "Energetic, visual thinker, loves clean UI and smooth animations. Uses analogies from design and user experience.",
    greeting: "Hey! I'm Alex, your Frontend mentor. Let's build something beautiful and functional together! 🎨",
  },
  data: {
    name: "Spark",
    personality: "Analytical, curious, loves finding patterns in data. Explains concepts using real-world examples and metrics.",
    greeting: "Hello! I'm Spark, your Data Analysis mentor. Ready to uncover insights and tell stories with data! 📊",
  },
  cloud: {
    name: "Cloud",
    personality: "Pragmatic, systems-oriented, focuses on reliability and automation. Uses infrastructure metaphors.",
    greeting: "Hi there! I'm Cloud, your DevOps mentor. Let's build scalable, reliable systems together! ☁️",
  },
  ux: {
    name: "Luna",
    personality: "Empathetic, user-focused, always thinking about the end user experience. Uses storytelling.",
    greeting: "Welcome! I'm Luna, your UX Design mentor. Let's create experiences that users will love! ✨",
  },
  backend: {
    name: "Core",
    personality: "Logical, detail-oriented, focuses on architecture and performance. Uses building metaphors.",
    greeting: "Hello! I'm Core, your Backend mentor. Let's architect robust systems and APIs! 🔧",
  },
};

// ============================================================================
// System Prompts
// ============================================================================

/**
 * Build a system prompt for the AI mentor
 */
export function buildMentorSystemPrompt(context: ConversationContext): string {
  const trackInfo = CAREER_TRACK_INFO[context.careerTrack];
  const persona = MENTOR_PERSONAS[context.careerTrack];

  return `You are ${persona.name}, an AI mentor specializing in ${trackInfo.fullName}.

PERSONA:
${persona.personality}

YOUR ROLE:
- Guide learners through their ${trackInfo.description} journey
- Provide clear, actionable advice and encouragement
- Use real-world examples and analogies
- Break down complex concepts into digestible pieces
- Celebrate progress and provide constructive feedback
- Ask thoughtful questions to deepen understanding

LEARNER CONTEXT:
- Career Track: ${trackInfo.fullName}
- Learning Level: ${context.learningLevel}
- Current Phase: ${context.currentPhase}
${context.currentTopic ? `- Current Topic: ${context.currentTopic}` : ""}
${context.recentConcepts ? `- Recent Concepts: ${context.recentConcepts.join(", ")}` : ""}

CORE SKILLS IN THIS TRACK:
${trackInfo.coreSkills.map(skill => `- ${skill}`).join("\n")}

COMMUNICATION STYLE:
- Be warm, encouraging, and professional
- Use emojis sparingly (1-2 per message max)
- Keep responses concise (2-3 short paragraphs)
- Ask follow-up questions when appropriate
- Relate technical concepts to ${trackInfo.description}
- Use ${persona.name}'s personality traits naturally

IMPORTANT GUIDELINES:
- Never give complete solutions - guide learners to discover answers
- Provide hints that get progressively more detailed if learner struggles
- Connect new concepts to previously learned material
- Encourage good practices from the start (testing, documentation, etc.)
- Be honest if you don't know something, but offer to explore together
- Adapt your language to the learner's level (${context.learningLevel})`;
}

/**
 * Build a prompt for career assessment analysis
 */
export function buildCareerAssessmentPrompt(
  responses: Array<{ question: string; answer: string | number }>,
  userBackground?: string
): string {
  const responseSummary = responses
    .map((r, i) => `Q${i + 1}: ${r.question}\nA${i + 1}: ${r.answer}`)
    .join("\n\n");

  return `Analyze the following aptitude quiz responses and suggest 2-3 relevant career paths.

${userBackground ? `BACKGROUND:\n${userBackground}\n\n` : ""}QUIZ RESPONSES:
${responseSummary}

AVAILABLE CAREER TRACKS:
${Object.entries(CAREER_TRACK_INFO).map(([key, info]) =>
    `- ${key}: ${info.fullName} - ${info.description}`
  ).join("\n")}

Please analyze the responses and return a JSON object with this structure:
{
  "suggestions": [
    {
      "track": "<career_track_key>",
      "confidence": <number 0-100>,
      "reasoning": "<2-3 sentences explaining why this is a good fit>",
      "keyStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
      "learningFocus": ["<focus area 1>", "<focus area 2>", "<focus area 3>"]
    }
  ],
  "overallAnalysis": "<1-2 paragraphs with overall assessment and encouragement>"
}

Provide 2-3 suggestions ordered by confidence (highest first).`;
}

/**
 * Build a prompt for generating concept cards
 */
export function buildConceptCardPrompt(
  careerTrack: CareerTrack,
  phase: LearningPhase,
  topic: string,
  learningLevel: LearningLevel,
  prerequisites?: string[]
): string {
  const trackInfo = CAREER_TRACK_INFO[careerTrack];

  return `Create a focused learning concept card for ${trackInfo.fullName}.

CONCEPT DETAILS:
- Topic: ${topic}
- Learning Phase: ${phase}
- Target Level: ${learningLevel}
${prerequisites ? `- Prerequisites: ${prerequisites.join(", ")}` : ""}

REQUIREMENTS:
- Design for 3-5 minute learning session
- Make it practical and immediately applicable
- Include concrete examples from ${trackInfo.description}
- Use clear, accessible language for ${learningLevel} level
- Focus on ONE core concept only

Return a JSON object with this structure:
{
  "title": "<engaging, clear title>",
  "summary": "<1-2 sentence overview>",
  "content": "<markdown-formatted lesson content (200-400 words)>",
  "estimatedMinutes": <3-5>,
  "keyTakeaways": ["<takeaway 1>", "<takeaway 2>", "<takeaway 3>"],
  "practicePrompt": "<hands-on exercise to apply the concept>",
  "resources": [
    {
      "title": "<resource name>",
      "url": "<hypothetical url>",
      "type": "article|video|interactive"
    }
  ]
}

Make the content engaging and build confidence. Relate to ${trackInfo.coreSkills.slice(0, 2).join(" and ")}.`;
}


/**
 * Build a prompt for generating a full lesson (compatible with LessonGenerationResponse)
 */
export function buildLessonPrompt(
  careerTrack: string,
  phase: string,
  topic: string,
  learningLevel: string
): string {
  const trackInfo = CAREER_TRACK_INFO[careerTrack as CareerTrack] || CAREER_TRACK_INFO.frontend;

  return `Create a comprehensive coding lesson for ${trackInfo.fullName}.

TOPIC: ${topic}
CONTEXT: ${phase} phase, ${learningLevel} level.

REQUIREMENTS:
- Structured sections (Introduction, Core Concept, Implementation, Best Practices)
- Code examples in ${trackInfo.coreSkills.find(s => s !== "Design") || "JavaScript/Python"}
- Practical usage scenarios
- Common pitfalls

Return a JSON object matching this structure (LessonGenerationResponse):
{
  "title": "${topic}",
  "overview": "<1-2 sentence hook>",
  "sections": [
    { "heading": "<Section Title>", "content": "<Paragraph text>" }
  ],
  "codeExamples": [
    { 
      "title": "<Example Name>", 
      "language": "<language>", 
      "code": "<code block>", 
      "explanation": "<how it works>" 
    }
  ],
  "keyTakeaways": ["<point 1>", "<point 2>"],
  "practice": {
    "prompt": "<Challenge description>",
    "steps": ["<step 1>", "<step 2>"],
    "expectedOutcome": "<what success looks like>"
  },
  "estimatedMinutes": <5-10>
}

Be educational, clear, and encouraging.`;
}

/**
 * Build a prompt for generating practice hints
 */
export function buildPracticeHintPrompt(
  conceptId: string,
  userCode: string,
  language: string,
  errorMessage: string | undefined,
  attemptsCount: number
): string {
  const hintLevel = attemptsCount <= 1 ? "gentle" : attemptsCount <= 3 ? "detailed" : "solution";

  return `Provide a ${hintLevel} hint for this coding practice problem.

CONTEXT:
- Concept: ${conceptId}
- Language: ${language}
- Attempts so far: ${attemptsCount}
${errorMessage ? `- Error: ${errorMessage}` : ""}

USER'S CODE:
\`\`\`${language}
${userCode}
\`\`\`

HINT LEVEL: ${hintLevel}
${hintLevel === "gentle" ? "Give a subtle nudge in the right direction without revealing the solution." : ""}
${hintLevel === "detailed" ? "Point out the specific issue and suggest how to fix it, but let them implement it." : ""}
${hintLevel === "solution" ? "Explain what's wrong and provide a clear solution with explanation." : ""}

Return a JSON object:
{
  "hint": "<your hint based on the level>",
  "hintLevel": "${hintLevel}",
  "encouragement": "<supportive message>"
}

Be constructive and encouraging. Focus on learning, not just solving.`;
}

/**
 * Build a prompt for generating code feedback
 */
export function buildFeedbackPrompt(
  conceptId: string,
  userCode: string,
  language: string,
  expectedOutput?: string,
  testResults?: { passed: boolean; message: string }[]
): string {
  return `Analyze this code submission and provide detailed, constructive feedback.

CONTEXT:
- Concept: ${conceptId}
- Language: ${language}
${expectedOutput ? `- Expected Output: ${expectedOutput}` : ""}

USER'S CODE:
\`\`\`${language}
${userCode}
\`\`\`

${testResults ? `TEST RESULTS:\n${testResults.map((t, i) => `Test ${i + 1}: ${t.passed ? "✓ PASS" : "✗ FAIL"} - ${t.message}`).join("\n")}` : ""}

Evaluate the code and return a JSON object:
{
  "score": <0-100>,
  "passed": <boolean>,
  "errors": [
    {
      "line": <number or null>,
      "message": "<what's wrong>",
      "suggestion": "<how to fix it>",
      "severity": "error|warning|info"
    }
  ],
  "explanation": "<1-2 paragraphs explaining the assessment>",
  "strengths": ["<what they did well 1>", "<what they did well 2>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>"],
  "nextSteps": ["<actionable next step 1>", "<actionable next step 2>"],
  "masteryLevel": "needs_review|proficient|mastered"
}

Be thorough but encouraging. Focus on learning and growth.`;
}

/**
 * Build a prompt for project review
 */
export function buildProjectReviewPrompt(
  projectId: string,
  careerTrack: CareerTrack,
  codeFiles: Array<{ filename: string; content: string }>,
  requirements: string[],
  rubricCriteria: string[]
): string {
  const trackInfo = CAREER_TRACK_INFO[careerTrack];
  const filesPreview = codeFiles.map(f =>
    `${f.filename}:\n\`\`\`\n${f.content.substring(0, 1000)}${f.content.length > 1000 ? "...(truncated)" : ""}\n\`\`\``
  ).join("\n\n");

  return `Conduct a professional project review for a ${trackInfo.fullName} project.

PROJECT: ${projectId}

REQUIREMENTS:
${requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}

CODE FILES:
${filesPreview}

EVALUATION CRITERIA:
${rubricCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Provide a comprehensive review as a JSON object:
{
  "overallScore": <0-100>,
  "rubricScores": [
    {
      "criterion": "<criterion name>",
      "score": <0-10>,
      "feedback": "<specific feedback>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "improvements": ["<improvement 1>", "<improvement 2>"]
    }
  ],
  "summary": "<2-3 sentences overall assessment>",
  "highlights": ["<notable achievement 1>", "<notable achievement 2>"],
  "areasForImprovement": ["<area 1>", "<area 2>", "<area 3>"],
  "nextSteps": ["<actionable step 1>", "<actionable step 2>"],
  "professionalFeedback": "<1-2 paragraphs as if from a senior ${trackInfo.fullName} engineer>"
}

Review like a supportive senior colleague, not a harsh critic.`;
}

// ============================================================================
// Context Management
// ============================================================================

/**
 * Format conversation history for context
 */
export function formatConversationHistory(
  messages: ConversationMessage[],
  maxMessages: number = 10
): string {
  const recentMessages = messages.slice(-maxMessages);

  return recentMessages
    .map(msg => `${msg.role === "mentor" ? "Mentor" : "Learner"}: ${msg.content}`)
    .join("\n\n");
}

/**
 * Build full context for mentor chat
 */
export function buildMentorChatContext(
  context: ConversationContext,
  conversationHistory?: ConversationMessage[]
): string {
  const systemPrompt = buildMentorSystemPrompt(context);

  let fullContext = systemPrompt;

  if (conversationHistory && conversationHistory.length > 0) {
    fullContext += `\n\n--- CONVERSATION HISTORY ---\n${formatConversationHistory(conversationHistory)}`;
  }

  return fullContext;
}

/**
 * Extract key topics from conversation
 */
export function extractTopicsFromMessages(messages: ConversationMessage[]): string[] {
  // This is a simple implementation - could be enhanced with NLP
  const allText = messages.map(m => m.content).join(" ").toLowerCase();
  const topics: string[] = [];

  // Extract common technical terms
  const topicPatterns = [
    /\b(react|vue|angular|svelte)\b/gi,
    /\b(javascript|typescript|python|sql)\b/gi,
    /\b(api|database|server|deployment)\b/gi,
    /\b(testing|debugging|performance)\b/gi,
  ];

  topicPatterns.forEach(pattern => {
    const matches = allText.match(pattern);
    if (matches) {
      topics.push(...new Set(matches.map(m => m.toLowerCase())));
    }
  });

  return Array.from(new Set(topics)).slice(0, 5);
}

// ============================================================================
// Voice-Optimized Prompts
// ============================================================================

/**
 * Build voice-optimized system prompt for mentor
 * 
 * Voice responses should be:
 * - Short (2-3 sentences max)
 * - Conversational and natural
 * - No formatting (bullets, code blocks, emojis)
 * - Include natural pauses
 */
export function buildVoiceSystemPrompt(
  context: ConversationContext,
  analysis?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    learningStyle: string | null;
    insights?: { content: string; type: string }[];
  } | null
): string {
  const trackInfo = CAREER_TRACK_INFO[context.careerTrack];
  const persona = MENTOR_PERSONAS[context.careerTrack];



  const basePrompt = `You are ${persona.name}, an AI mentor speaking to a learner via VOICE.

PERSONA:
${persona.personality}

VOICE COMMUNICATION RULES (CRITICAL):
- Keep responses SHORT: 2-3 sentences maximum
- Use natural, conversational language as if face-to-face
- Speak as a human would speak, not write
- NO emojis, NO bullet points, NO code blocks, NO markdown
- Use commas and periods for natural pauses
- Ask ONE simple question at a time
- Be warm, encouraging, and supportive
- Avoid technical jargon unless necessary

GOOD VOICE RESPONSE EXAMPLES:
"Great question! React hooks let you use state in function components. This makes your code much cleaner. Want to try a simple example?"

"I can help with that. First, let's break it down into smaller steps. What part feels most confusing to you?"

BAD VOICE RESPONSE EXAMPLES (TOO LONG/FORMATTED):
"React hooks are a feature introduced in React 16.8 that enables you to use state and other React features without writing a class. Here are the main hooks: 1. useState for state management, 2. useEffect for side effects..."

LEARNER CONTEXT:
- Career Track: ${trackInfo.fullName}
- Learning Level: ${context.learningLevel}
- Current Phase: ${context.currentPhase}
${context.currentTopic ? `- Current Topic: ${context.currentTopic}` : ""}
${context.recentConcepts ? `- Recent Concepts: ${context.recentConcepts.join(", ")}` : ""}

YOUR ROLE:
- Guide through ${trackInfo.description}
- Provide clear, actionable advice
- Use real-world examples
- Build confidence through encouragement
- Keep it conversational and human


Remember: You're SPEAKING, not writing. Keep it short, warm, and natural.`;

  if (analysis) {
    return `${basePrompt}

MENTOR MEMORY (USER PROFILE):
- Summary: ${analysis.summary}
- Learning Style: ${analysis.learningStyle || "Unknown"}
- Strengths: ${analysis.strengths.join(", ")}
- Areas for Growth: ${analysis.weaknesses.join(", ")}
${analysis.insights && analysis.insights.length > 0 ? `\nACTIVE INSIGHTS TO MENTION:\n${analysis.insights.map(i => `- [${i.type.toUpperCase()}] ${i.content}`).join("\n")}` : ""}

INSTRUCTION:
Use this memory to personalize your advice. If the user has a specific learning style (e.g. "Visual"), try to describe things visually. If they have a known weakness, be extra supportive there.`;
  }

  return basePrompt;
}


/**
 * Build voice-optimized prompt for user message
 */
export function buildVoiceChatPrompt(
  userMessage: string,
  context: ConversationContext,
  conversationHistory?: ConversationMessage[],
  analysis?: any // We pass this through to system prompt
): string {
  const systemPrompt = buildVoiceSystemPrompt(context, analysis);

  let fullPrompt = systemPrompt;

  // Add recent context if available
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = formatConversationHistory(conversationHistory, 5);
    fullPrompt += `\n\n--- RECENT CONVERSATION ---\n${recentHistory}`;
  }

  // Add current user message
  fullPrompt += `\n\n--- LEARNER JUST SAID (via voice) ---\n${userMessage}`;

  fullPrompt += `\n\n--- YOUR VOICE RESPONSE (remember: 2-3 sentences max, conversational, no formatting) ---`;

  return fullPrompt;
}
