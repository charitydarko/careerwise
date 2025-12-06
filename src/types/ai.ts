/**
 * AI Types and Interfaces
 * 
 * Centralized type definitions for all AI-related functionality
 * across the CareerWise platform.
 */

// ============================================================================
// Career Track Types
// ============================================================================

export type CareerTrack = "frontend" | "data" | "cloud" | "ux" | "backend";

export type LearningLevel = "beginner" | "intermediate" | "advanced";

export type LearningPhase = "fundamentals" | "tools" | "projects" | "job_readiness";

// ============================================================================
// AI Model Configuration
// ============================================================================

export interface AIModelConfig {
  model: string;
  temperature: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

// ============================================================================
// Conversation & Chat Types
// ============================================================================

export interface ConversationMessage {
  role: "user" | "mentor";
  content: string;
  timestamp: Date;
}

export interface ConversationContext {
  userId: string;
  careerTrack: CareerTrack;
  learningLevel: LearningLevel;
  currentPhase: LearningPhase;
  currentTopic?: string;
  recentConcepts?: string[];
}

export interface MentorChatRequest {
  message: string;
  context: ConversationContext;
  conversationHistory?: ConversationMessage[];
}

export interface MentorChatResponse {
  message: string;
  suggestions?: string[];
  relatedConcepts?: string[];
}

// ============================================================================
// Career Assessment Types
// ============================================================================

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "rating" | "open_ended";
  options?: string[];
  nextQuestionLogic?: Record<string, string>; // answer -> next question ID
}

export interface QuizResponse {
  questionId: string;
  answer: string | number;
}

export interface CareerPathSuggestion {
  track: CareerTrack;
  confidence: number; // 0-100
  reasoning: string;
  keyStrengths: string[];
  learningFocus: string[];
}

export interface CareerAssessmentRequest {
  responses: QuizResponse[];
  userBackground?: string;
}

export interface CareerAssessmentResponse {
  suggestions: CareerPathSuggestion[];
  overallAnalysis: string;
}

// ============================================================================
// Content Generation Types
// ============================================================================

export interface ConceptCardRequest {
  careerTrack: CareerTrack;
  phase: LearningPhase;
  topic: string;
  learningLevel: LearningLevel;
  prerequisites?: string[];
}

export interface ConceptCard {
  title: string;
  summary: string;
  content: string; // Markdown format
  estimatedMinutes: number;
  keyTakeaways: string[];
  practicePrompt?: string;
  resources?: Array<{
    title: string;
    url: string;
    type: "article" | "video" | "interactive";
  }>;
}

export interface LessonGenerationRequest {
  topic: string;
  difficulty: LearningLevel;
  careerTrack: CareerTrack;
  estimatedMinutes?: number;
  focusArea?: string;
}

export interface LessonSection {
  heading: string;
  content: string;
}

export interface LessonGenerationResponse {
  title: string;
  overview: string;
  sections: LessonSection[];
  codeExamples: Array<{
    title: string;
    language: string;
    code: string;
    explanation: string;
  }>;
  keyTakeaways: string[];
  practice: {
    prompt: string;
    steps: string[];
    expectedOutcome?: string;
  };
  estimatedMinutes: number;
}

export interface LearningPathRequest {
  careerTrack: CareerTrack;
  goalStatement: string;
  hoursPerWeek: number;
  currentLevel: LearningLevel;
}

export interface LearningPathPhase {
  phase: LearningPhase;
  title: string;
  description: string;
  estimatedWeeks: number;
  concepts: string[];
  milestones: string[];
}

export interface LearningPathResponse {
  phases: LearningPathPhase[];
  totalEstimatedWeeks: number;
  nextSteps: string;
}

// ============================================================================
// Practice & Feedback Types
// ============================================================================

export interface PracticeHintRequest {
  conceptId: string;
  userCode: string;
  language: string;
  errorMessage?: string;
  attemptsCount: number;
}

export interface PracticeHintResponse {
  hint: string;
  hintLevel: "gentle" | "detailed" | "solution";
  encouragement: string;
}

export interface FeedbackRequest {
  conceptId: string;
  userCode: string;
  language: string;
  expectedOutput?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

export interface CodeError {
  line?: number;
  column?: number;
  message: string;
  suggestion: string;
  severity: "error" | "warning" | "info";
}

export interface FeedbackResponse {
  score: number; // 0-100
  passed: boolean;
  errors: CodeError[];
  explanation: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
  masteryLevel: "needs_review" | "proficient" | "mastered";
}

// ============================================================================
// Mastery & Assessment Types
// ============================================================================

export interface QuizGenerationRequest {
  careerTrack: CareerTrack;
  conceptsCovered: string[];
  difficulty: LearningLevel;
  questionCount: number;
}

export interface QuizQuestionGenerated {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  concept: string;
}

export interface QuizGenerationResponse {
  questions: QuizQuestionGenerated[];
  passingScore: number;
}

export interface MasteryEvaluationRequest {
  conceptId: string;
  quizScore?: number;
  practiceAttempts: number;
  practiceScores: number[];
  timeSpent: number; // minutes
}

export interface MasteryEvaluationResponse {
  masteryLevel: "needs_review" | "proficient" | "mastered";
  recommendation: "review" | "practice_more" | "advance";
  reviewTopics?: string[];
  nextConcepts?: string[];
  feedback: string;
}

// ============================================================================
// Project Review Types
// ============================================================================

export interface ProjectReviewRequest {
  projectId: string;
  careerTrack: CareerTrack;
  repositoryUrl?: string;
  codeFiles?: Array<{
    filename: string;
    content: string;
    language: string;
  }>;
  requirements: string[];
  rubricCriteria: string[];
}

export interface RubricScore {
  criterion: string;
  score: number; // 0-10
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface ProjectReviewResponse {
  overallScore: number; // 0-100
  rubricScores: RubricScore[];
  summary: string;
  highlights: string[];
  areasForImprovement: string[];
  nextSteps: string[];
  professionalFeedback: string;
}

export interface ProjectSanityCheckRequest {
  projectId: string;
  milestoneNumber: number;
  description: string;
  completedRequirements: string[];
  pendingRequirements: string[];
}

export interface ProjectSanityCheckResponse {
  onTrack: boolean;
  feedback: string;
  suggestions: string[];
  warnings?: string[];
  encouragement: string;
}

// ============================================================================
// Interview Simulation Types
// ============================================================================

export interface InterviewGenerationRequest {
  careerTrack: CareerTrack;
  type: "technical" | "behavioral" | "mixed";
  difficulty: LearningLevel;
  questionCount: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: "technical" | "behavioral";
  category: string;
  expectedAnswerPoints: string[];
  followUpQuestions?: string[];
}

export interface InterviewGenerationResponse {
  questions: InterviewQuestion[];
  estimatedDuration: number; // minutes
  tips: string[];
}

export interface InterviewResponseEvaluationRequest {
  questionId: string;
  question: string;
  userResponse: string;
  expectedAnswerPoints: string[];
  careerTrack: CareerTrack;
}

export interface InterviewResponseEvaluation {
  score: number; // 0-10
  strengths: string[];
  improvements: string[];
  missedPoints: string[];
  feedback: string;
  suggestions: string[];
}

// ============================================================================
// Error Types
// ============================================================================

export interface AIError {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export class AIServiceError extends Error {
  code: string;
  retryable: boolean;
  details?: Record<string, unknown>;

  constructor(error: AIError) {
    super(error.message);
    this.name = "AIServiceError";
    this.code = error.code;
    this.retryable = error.retryable;
    this.details = error.details;
  }
}

// ============================================================================
// Utility Types
// ============================================================================

export interface AIRequestMetadata {
  requestId: string;
  timestamp: Date;
  userId?: string;
  careerTrack?: CareerTrack;
}

export interface AIResponseMetadata {
  requestId: string;
  timestamp: Date;
  model: string;
  tokensUsed?: number;
  latency: number; // milliseconds
}

export interface AIResult<T> {
  data: T;
  metadata: AIResponseMetadata;
  cached?: boolean;
}
