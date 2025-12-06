# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**CareerWise** is an AI-powered career learning platform that provides personalized, interactive career education from aptitude assessment through job readiness. The platform uses Google Gemini AI to deliver adaptive learning experiences, real-time feedback, and intelligent mentorship.

### Product Vision

CareerWise transforms career education through:
1. **AI Career Profiler** - Interactive aptitude quiz that suggests 2-3 relevant career paths
2. **Dynamic Curriculum Roadmap** - Visual journey showing phases (Fundamentals, Tools, Projects) with estimated completion times
3. **AI Mentor (Gemini-powered)** - Personalized AI persona that guides learners through their entire journey
4. **Concept Cards** - Bite-sized 3-5 minute learning modules with immediate practice
5. **Sandbox Environments** - Interactive code editors, design tools, and practice spaces with real-time AI hints
6. **Intelligent Feedback** - Instant scoring, error analysis, and personalized explanations
7. **Mastery Gating** - Quizzes and challenges ensure solid foundations before advancing
8. **Project-Based Learning** - Scaffolded real-world projects with AI rubric reviews
9. **Mock Interview System** - AI-powered interview simulations for job readiness

### Current Implementation Status

**Phase 0 - MVP Demo (Current):**
- Static onboarding flow with track selection
- Mock dashboard with 14-day sprint plans
- UI-only AI mentor chat interface
- Mock data for tasks and resources

**Phase 1 - AI Integration (In Progress):**
- Gemini AI integration for mentor interactions
- Dynamic content generation
- Real-time feedback systems

**Future Phases:** Interactive sandboxes, project scaffolding, assessment engines, interview simulations

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **AI Model:** Google Gemini API (primary AI engine with voice capabilities)
- **Voice I/O:** Web Speech API (browser-native) + Gemini voice models
- **Audio Processing:** MediaRecorder API, Audio Context API
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI primitives
- **Email Service:** Resend API
- **PDF Generation:** pdf-lib
- **Code Execution:** (Planned) Sandboxed environments for practice
- **Real-time:** WebSocket for live voice streaming and AI feedback

## Development Commands

### Core Commands
```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Database Commands
```bash
# Generate Prisma client (after schema changes)
npm run prisma:generate

# Deploy migrations to database
npm run prisma:migrate
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `DATABASE_URL`: PostgreSQL connection string (Neon database)
- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `RESEND_API_KEY`: API key for email service
- `RESEND_FROM_EMAIL`: Sender email address (optional, defaults to plans@careerwise.ai)

## Complete User Journey

The platform guides users through a comprehensive learning journey:

### 1. Aptitude Assessment & Career Profiling
- **Entry:** User signs up and starts interactive questionnaire
- **Process:** Branching logic quiz gauges aptitude, interests, and knowledge
- **AI Role:** Gemini analyzes responses to suggest 2-3 relevant career paths
- **Output:** User selects one path (e.g., Frontend Dev, Data Analyst, UX Designer)

### 2. Dynamic Curriculum Roadmap
- **Visual Journey:** Shows complete learning path with phases (Fundamentals, Tools, Projects)
- **Timeline:** Displays estimated completion time based on user's time commitment
- **Adaptive:** Roadmap adjusts based on user progress and mastery levels

### 3. AI Mentor Introduction (Voice-First)
- **Voice Greeting:** AI mentor introduces itself with voice (e.g., "Hello, I'm Spark, your Data Analysis mentor!")
- **Natural Conversation:** User speaks to mentor, mentor responds with voice
- **Visual Support:** Text transcript appears for accessibility and review
- **Goal Setting:** Mentor has natural voice conversation to define learning objectives
- **Context:** Maintains voice conversation history throughout learning journey
- **Fallback:** Chat mode available for text-only environments

### 4. Concept-Based Learning Loop

**a) Concept Card Delivery**
- Bite-sized 3-5 minute lessons (text, video, interactive diagrams)
- Single focused concept (e.g., "What is a conditional statement?")

**b) Sandbox Practice**
- Immediate application in simulated environment:
  - Code editor for programming concepts
  - Drag-and-drop for design concepts
  - Spreadsheet/data tools for analytics
- Real-time AI hints via "Stuck?" button
- Safe, limited environment for experimentation

**c) Intelligent Feedback**
- Instant scoring on submission
- Detailed error analysis explaining why answer was wrong
- Personalized explanations on how to fix mistakes
- Focus on mastery, not just pass/fail

**d) Contextual AI Chat**
- Always-accessible "Ask Your Mentor" window
- Handles questions like "How is this used in real jobs?"
- Provides real-world examples and analogies
- Maintains full conversational context

### 5. Mastery Gating
- Periodic quizzes/challenges after several concepts
- AI determines mastery level
- Suggests review modules or progression to next concept
- Ensures solid foundations before advancing

### 6. Project-Based Learning

**a) Project Assignment**
- Scaffolded real-world projects (e.g., "Build a weather app")
- Clear requirements, assets, and suggested steps
- Ties together multiple learned concepts

**b) Milestone Reviews**
- Structured checkpoints during development
- AI Mentor conducts "Project Sanity Checks"
- Guidance without solving the problem

**c) AI Rubric Review**
- Multi-point professional review:
  - Code efficiency
  - Design principles
  - Error handling
  - Best practices
- Feedback mimics senior colleague or hiring manager
- Identifies areas for improvement and next steps

### 7. Job Readiness - Mock Interviews
- Simulated interviews based on career track
- Common technical and behavioral questions
- Text or voice response options
- Immediate AI feedback on answers
- Iterative practice until job-ready

## Project Architecture

### Application Structure

The app follows Next.js 16 App Router patterns with a clear separation of concerns:

```
src/
├── app/                    # Next.js App Router pages
│   ├── (pages)/           # Main application pages
│   ├── api/               # API routes (server-side)
│   └── layout.tsx         # Root layout with fonts & metadata
├── components/
│   ├── ui/                # Radix UI components (button, card, select, etc.)
│   └── fade-in-section.tsx # Reusable animation wrapper
├── data/                  # Mock data & type definitions
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client singleton
│   └── utils.ts          # Tailwind class merging utility
└── generated/prisma/      # Generated Prisma client (after prisma:generate)
```

### Key Application Flows

**1. User Onboarding (`/onboarding`)**
- Multi-step wizard collecting user goals, focus track, time commitment, and engagement preferences
- Supports voice-guided or chat-based onboarding
- Generates personalized 14-day sprint plan
- Offers email delivery of plan summary with PDF attachment
- Uses client-side state management with React hooks

**2. Dashboard (`/dashboard`)**
- Main hub showing current sprint progress, daily tasks, and achievements
- Plan version selector to switch between different sprint iterations
- Real-time voice/chat mentor interaction panel
- Progress tracking with streak counter and completion percentage
- Sub-routes:
  - `/dashboard/tasks` - Full task list view
  - `/dashboard/tasks/[taskId]` - Individual task detail
  - `/dashboard/progress` - Timeline and achievement history
  - `/dashboard/tracker` - Sprint analytics

**3. Landing Page (`/`)**
- Marketing site with hero, feature sections, social proof, and footer
- Floating login button for easy access
- Email waitlist capture
- Responsive design with animation components

### Data Layer

**Current State:** Application uses mock data during development
- `src/data/mock-tasks.ts` - Task definitions with resources and checklists
- `src/data/mock-admin.ts` - Learning resources, agent prompts, plan versions

**Future State:** Prisma schema defined but minimal (only datasource configured)
- Custom Prisma client output: `src/generated/prisma`
- Database provider: PostgreSQL (Neon)

### API Routes

**POST `/api/send-plan`**
- Accepts: `{ email: string, plan: PlanSummaryPayload }`
- Generates PDF with plan summary using pdf-lib
- Sends email via Resend with HTML, text, and PDF attachment
- Server-side only (`"use server"`)

## Styling & Design System

### Color Palette
- **Primary Blue:** `#1F3C88` - Headers, primary CTAs
- **Accent Teal:** `#00BFA6` - Success states, progress indicators
- **Background:** `#f6f9ff`, `#f3f6ff`, `#f5f8ff` - Light blue gradients
- **Difficulty badges:**
  - Starter: `#ecfdf9` bg, `#007864` text
  - Focus: `#e0f2fe` bg, `#1F3C88` text
  - Deep Work: `#fef3c7` bg, `#b45309` text

### Typography
- Primary font: Inter (via `next/font/google`)
- Display fonts: Geist Sans, Geist Mono
- Font variable: `font-[family:var(--font-inter)]`

### Component Patterns
- **Cards:** Rounded 3xl borders (`rounded-3xl`), white/95 bg with backdrop blur
- **Buttons:** Rounded full, shadow effects with color/opacity
- **Forms:** Rounded full inputs with icon positioning
- **Animations:** Custom animation classes (`animate-float`, audio pulse bars)

### Utility Function
Use `cn()` from `@/lib/utils` to merge Tailwind classes conditionally:
```typescript
import { cn } from "@/lib/utils";
className={cn("base-class", condition && "conditional-class")}
```

## Code Conventions

### Client vs Server Components
- **Client components:** Use `"use client"` directive at top of file
  - All pages with interactivity (forms, state, hooks)
  - Dashboard, onboarding, landing page
- **Server components:** Default for API routes
  - Use `"use server"` for API route handlers

### Path Aliases
Import using `@/*` alias for src directory:
```typescript
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
```

### Type Definitions
- Define types inline or at top of file
- Use TypeScript's `type` for simple types, `interface` for extendable objects
- Export types from data files when used across multiple files

### State Management
- Local state via React `useState`, `useMemo`, `useEffect`
- No global state management library currently in use
- Complex flows use derived state and memoization

## Testing & Quality

### Linting
- ESLint configured with Next.js defaults
- Config: `eslint.config.mjs` (flat config format)
- Uses `eslint-config-next` for TypeScript and core web vitals

### Type Checking
- Run `npx tsc --noEmit` to type-check without building
- Strict mode enabled in `tsconfig.json`

## Development Patterns

### Adding New Pages
1. Create page in `src/app/[route]/page.tsx`
2. Use `"use client"` if page needs interactivity
3. Export default function with page component
4. Add to navigation/routing as needed

### Adding New API Routes
1. Create route in `src/app/api/[route]/route.ts`
2. Add `"use server"` directive
3. Export HTTP method handlers (GET, POST, etc.)
4. Return `NextResponse.json()` for responses

### Working with Prisma
1. Define models in `prisma/schema.prisma`
2. Run `npm run prisma:generate` to update client
3. Import client: `import { prisma } from "@/lib/prisma"`
4. Note: Prisma client outputs to `src/generated/prisma` (non-standard location)

### Adding UI Components
1. Use Radix UI primitives as base when possible
2. Add components to `src/components/ui/`
3. Style with Tailwind classes
4. Use `cn()` utility for conditional classes
5. Follow existing component patterns (rounded-3xl, backdrop-blur, etc.)

## Image Configuration

Next.js image optimization is configured for:
- `images.unsplash.com` - Marketing images
- `i.pravatar.cc` - Avatar placeholders

Add new domains to `next.config.ts` under `images.remotePatterns`.

## Gemini AI Integration

### AI Use Cases

The platform uses Google Gemini for multiple intelligent features:

1. **Career Path Analysis**
   - Analyze aptitude quiz responses
   - Suggest 2-3 relevant career paths
   - Generate personalized career reasoning

2. **AI Mentor Conversations**
   - Contextual chat responses
   - Real-world examples and analogies
   - Learning objective guidance

3. **Real-time Hints**
   - Context-aware assistance during practice
   - Progressive hint system (gentle → detailed)
   - Avoid giving direct answers

4. **Intelligent Feedback**
   - Analyze practice submissions
   - Generate detailed error explanations
   - Provide personalized improvement suggestions

5. **Content Generation**
   - Dynamic concept cards
   - Adaptive learning paths
   - Personalized quiz questions

6. **Project Reviews**
   - Multi-criteria rubric evaluation
   - Professional-grade feedback
   - Improvement recommendations

7. **Interview Simulations**
   - Generate relevant interview questions
   - Evaluate response quality
   - Provide constructive feedback

### AI Integration Patterns

**API Route Structure:**
```typescript
// src/app/api/ai/[feature]/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: Request) {
  // Extract user input and context
  // Call Gemini API with appropriate prompt
  // Process and return structured response
}
```

**Recommended API Routes:**
- `/api/ai/career-assessment` - Analyze quiz responses
- `/api/ai/mentor-chat` - Handle mentor conversations
- `/api/ai/practice-hint` - Provide contextual hints
- `/api/ai/feedback` - Generate feedback on submissions
- `/api/ai/project-review` - Evaluate project submissions
- `/api/ai/interview` - Conduct mock interviews

**Prompt Engineering Guidelines:**
- Always include user's career track context
- Maintain learning level (beginner/intermediate/advanced)
- Use structured output formats (JSON when possible)
- Implement temperature settings per use case:
  - 0.3-0.5 for feedback/assessment (precise)
  - 0.6-0.8 for creative content generation
  - 0.4-0.6 for mentor conversations (balanced)

**Context Management:**
- Store conversation history in database
- Include recent interactions in prompts
- Track user progress for adaptive responses
- Maintain separate context per feature (mentor vs. practice)

## Important Notes

- **Mock Data:** The application currently uses mock data from `src/data/` files. When implementing real database functionality, replace imports with Prisma queries.
- **Authentication:** No authentication system is currently implemented. Login/signup pages exist but are not functional.
- **AI Integration:** Gemini API key required for all AI features. Start with mentor chat, then expand to other features.
- **Email Service:** Requires `RESEND_API_KEY` environment variable to send emails.
- **Prisma Output:** Custom Prisma client location requires running `prisma:generate` after schema changes.
- **Font Loading:** Uses Next.js font optimization with Google Fonts (Inter, Geist Sans, Geist Mono).
