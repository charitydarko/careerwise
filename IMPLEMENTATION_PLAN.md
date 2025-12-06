# CareerWise Implementation Plan

This document outlines the phased approach to evolving CareerWise from its current MVP state to the complete AI-powered learning platform.

## Current State (Phase 0)

✅ **Completed:**
- Landing page with marketing content
- Static onboarding flow (track selection, goals, time commitment)
- Mock dashboard with sprint overview
- UI-only chat interface
- Email plan delivery with PDF generation
- Mock data structure for tasks, resources, and plans

## Phase 1: Core AI Integration (Priority: HIGH)

**Goal:** Replace mock interactions with real Gemini AI responses

### 1.1 Setup & Infrastructure (Week 1)
- [ ] Install Gemini SDK: `npm install @google/generative-ai`
- [ ] Add `GEMINI_API_KEY` to environment variables
- [ ] Create AI service layer: `src/lib/gemini.ts`
- [ ] Create AI utilities for prompt management
- [ ] Set up error handling and rate limiting

### 1.2 Voice-First AI Mentor (Week 1-2)
**PRIMARY:** Voice interaction  
**SECONDARY:** Text chat (fallback)

**Files:**
- `src/app/api/voice/chat/route.ts` - Voice conversation endpoint
- `src/app/api/ai/mentor-chat/route.ts` - Text chat fallback
- `src/lib/voice-service.ts` - Voice processing utilities
- `src/components/voice/voice-panel.tsx` - Voice UI component

**Features:**
- Real-time voice conversation with Gemini voice models
- Speech-to-text (user audio → text)
- AI response generation (voice-optimized prompts)
- Text-to-speech (response → audio)
- Visual transcript display
- Text chat fallback for silent environments
- Career-specific mentor personas with unique voices

**Database Schema Additions:**
```prisma
model Conversation {
  id        String   @id @default(cuid())
  userId    String
  role      String   // "mentor" | "user"
  content   String
  context   Json     // Career track, current topic, etc.
  createdAt DateTime @default(now())
}

model UserProfile {
  id           String   @id @default(cuid())
  email        String   @unique
  careerTrack  String
  currentPhase String
  learningLevel String  // "beginner" | "intermediate" | "advanced"
}
```

**Implementation Steps:**
1. Create conversation history storage
2. Build context injection system
3. Implement Gemini API calls with streaming
4. Update dashboard chat UI to consume real API
5. Add typing indicators and message history

### 1.3 Career Assessment AI (Week 2-3)
**File:** `src/app/api/ai/career-assessment/route.ts`

**Features:**
- Analyze quiz responses
- Suggest 2-3 relevant career paths
- Generate reasoning for each suggestion

**Tasks:**
1. Design branching quiz logic (replace static track selection)
2. Create quiz component with dynamic questions
3. Build AI analysis endpoint
4. Generate career path recommendations
5. Update onboarding flow to use AI suggestions

### 1.4 Dynamic Content Generation (Week 3-4)
**File:** `src/app/api/ai/generate-content/route.ts`

**Features:**
- Generate concept cards on-demand
- Create personalized learning paths
- Adapt content based on user progress

**Database Schema:**
```prisma
model ConceptCard {
  id              String   @id @default(cuid())
  title           String
  content         String   // Text, markdown, or structured content
  careerTrack     String
  phase           String   // "fundamentals" | "tools" | "projects"
  estimatedMinutes Int
  prerequisites   String[]
  generatedBy     String   // "ai" | "manual"
  createdAt       DateTime @default(now())
}

model UserProgress {
  id          String   @id @default(cuid())
  userId      String
  conceptId   String
  status      String   // "not_started" | "in_progress" | "completed"
  masteryScore Float?
  attempts    Int      @default(0)
  completedAt DateTime?
}
```

## Phase 2: Interactive Learning (Priority: HIGH)

### 2.1 Concept Cards System (Week 4-5)
**Components:**
- `src/components/concept-card.tsx`
- `src/components/concept-viewer.tsx`
- `src/app/learn/[conceptId]/page.tsx`

**Features:**
- Bite-sized 3-5 minute lessons
- Video/text/interactive content support
- Progress tracking
- Next concept suggestions

### 2.2 Practice Sandbox - Code Editor (Week 5-7)
**Integration:** Monaco Editor or CodeMirror

**Files:**
- `src/components/sandbox/code-editor.tsx`
- `src/app/api/ai/practice-hint/route.ts`
- `src/app/api/code/execute/route.ts` (if server-side execution needed)

**Features:**
- In-browser code editor
- Real-time AI hints via "Stuck?" button
- Syntax highlighting per language
- Test case validation

**Considerations:**
- Use WebContainers for safe code execution (optional)
- Or use third-party API like Judge0 for execution
- Start with client-side validation for simple exercises

### 2.3 AI Feedback System (Week 7-8)
**File:** `src/app/api/ai/feedback/route.ts`

**Features:**
- Instant scoring of submissions
- Detailed error analysis
- Personalized improvement suggestions
- Mastery scoring

**Implementation:**
```typescript
interface FeedbackRequest {
  conceptId: string;
  userCode: string;
  language: string;
  expectedOutput?: string;
}

interface FeedbackResponse {
  score: number; // 0-100
  passed: boolean;
  errors: Array<{
    line: number;
    message: string;
    suggestion: string;
  }>;
  explanation: string;
  nextSteps: string[];
  masteryLevel: "needs_review" | "proficient" | "mastered";
}
```

### 2.4 Mastery Gating System (Week 8-9)
**Database Schema:**
```prisma
model Quiz {
  id          String   @id @default(cuid())
  phase       String
  careerTrack String
  questions   Json     // Array of question objects
  passingScore Float
}

model QuizAttempt {
  id          String   @id @default(cuid())
  userId      String
  quizId      String
  score       Float
  answers     Json
  passed      Boolean
  completedAt DateTime @default(now())
}
```

**Features:**
- Periodic quizzes after concept groups
- AI-generated questions based on concepts covered
- Mastery determination
- Adaptive review suggestions

## Phase 3: Project-Based Learning (Priority: MEDIUM)

### 3.1 Project Scaffolding System (Week 9-11)
**Database Schema:**
```prisma
model Project {
  id              String   @id @default(cuid())
  title           String
  description     String
  careerTrack     String
  requirements    Json     // Array of requirement objects
  assets          Json     // Starter files, images, etc.
  milestones      Json     // Array of checkpoint descriptions
  rubric          Json     // Evaluation criteria
  estimatedHours  Int
}

model ProjectSubmission {
  id              String   @id @default(cuid())
  userId          String
  projectId       String
  status          String   // "in_progress" | "submitted" | "reviewed"
  repositoryUrl   String?
  liveUrl         String?
  milestoneStatus Json
  submittedAt     DateTime?
}
```

**Features:**
- Project brief with clear requirements
- Starter file provision
- Milestone tracking
- External IDE/tool integration support

### 3.2 AI Project Reviews (Week 11-12)
**File:** `src/app/api/ai/project-review/route.ts`

**Features:**
- Multi-criteria rubric evaluation
- Code quality assessment
- Design principle analysis
- Professional feedback generation

**Rubric Categories:**
- Code efficiency & organization
- Error handling
- Design principles (if applicable)
- Best practices adherence
- User experience (if applicable)

### 3.3 Project Sanity Checks (Week 12)
**File:** `src/app/api/ai/sanity-check/route.ts`

**Features:**
- Lightweight checkpoint reviews
- Guidance without solutions
- Progress validation
- Direction correction

## Phase 4: Advanced Features (Priority: MEDIUM)

### 4.1 Design Tool Sandbox (Week 13-15)
**Integration:** Figma embed or Excalidraw

**Use Cases:**
- UX/UI design exercises
- Wireframe creation
- Design system practice

### 4.2 Data Analysis Sandbox (Week 15-16)
**Integration:** AG Grid or similar

**Features:**
- Spreadsheet interface
- Data visualization
- SQL query practice
- Chart creation

### 4.3 Mock Interview System (Week 16-18)
**Files:**
- `src/app/interview/page.tsx`
- `src/app/api/ai/interview/route.ts`

**Features:**
- Career-specific question generation
- Technical & behavioral questions
- Text and voice response support
- Real-time feedback
- Interview performance tracking

**Database Schema:**
```prisma
model InterviewSession {
  id          String   @id @default(cuid())
  userId      String
  careerTrack String
  type        String   // "technical" | "behavioral" | "mixed"
  questions   Json
  responses   Json
  feedback    Json
  overallScore Float
  completedAt DateTime @default(now())
}
```

## Phase 5: Polish & Optimization (Priority: LOW)

### 5.1 Authentication & User Management (Week 19-20)
**Integration:** NextAuth.js or Clerk

**Features:**
- Email/password authentication
- Social login (Google, GitHub)
- User profile management
- Progress persistence

### 5.2 Real-time Features (Week 20-21)
**Integration:** WebSockets or Server-Sent Events

**Features:**
- Live AI hint delivery
- Real-time collaboration (optional)
- Live progress updates
- Streaming AI responses

### 5.3 Analytics & Insights (Week 21-22)
**Features:**
- Learning analytics dashboard
- Progress visualization
- Time tracking
- Completion rates
- Mastery metrics

### 5.4 Performance Optimization (Week 22-23)
**Tasks:**
- [ ] Implement caching for AI responses
- [ ] Optimize database queries
- [ ] Add CDN for static assets
- [ ] Implement lazy loading
- [ ] Add loading states and skeletons
- [ ] Optimize bundle size

## Implementation Priority Matrix

### Sprint 1 (Weeks 1-4): Foundation
1. ✅ Gemini AI setup
2. ✅ AI Mentor Chat
3. ✅ Career Assessment
4. ✅ Dynamic Content Generation

### Sprint 2 (Weeks 5-8): Core Learning
1. ✅ Concept Cards System
2. ✅ Code Editor Sandbox
3. ✅ AI Feedback System
4. ✅ Mastery Gating

### Sprint 3 (Weeks 9-12): Projects
1. ✅ Project Scaffolding
2. ✅ AI Project Reviews
3. ✅ Milestone Tracking

### Sprint 4 (Weeks 13-18): Advanced Features
1. ⏳ Additional Sandboxes
2. ⏳ Mock Interviews
3. ⏳ Advanced Analytics

### Sprint 5 (Weeks 19-23): Production Ready
1. ⏳ Authentication
2. ⏳ Real-time Features
3. ⏳ Performance & Polish

## Technical Decisions

### AI Model Selection
- **Primary:** Gemini Pro (text generation, chat, analysis)
- **Voice:** Gemini Pro with audio capabilities (when available)
- **Vision:** Gemini Pro Vision (for analyzing code screenshots, diagrams)

### Code Execution Strategy
**Options:**
1. **Client-side only:** For simple validation (HTML/CSS/JS basics)
2. **WebContainers:** For safe Node.js execution in browser
3. **Third-party API:** Judge0 or similar for multi-language support
4. **Hybrid:** Client-side for simple, server-side for complex

**Recommendation:** Start with client-side, add server-side as needed

### Database Strategy
- **Development:** Local PostgreSQL or Neon free tier
- **Production:** Neon or Supabase (PostgreSQL)
- **Caching:** Redis for AI response caching (optional)

### File Storage
- **User Projects:** GitHub integration (link repos) or S3-compatible storage
- **Assets:** Vercel Blob or Cloudflare R2

## Success Metrics

### Phase 1
- AI mentor responds within 2 seconds
- Career assessment accuracy (qualitative user feedback)
- 90%+ uptime for AI features

### Phase 2
- Users complete at least 3 concept cards
- Average practice time: 15-20 minutes per session
- Mastery gate pass rate: 60-80%

### Phase 3
- At least 1 project completion per user
- AI review quality rating: 4+/5
- Project iteration rate: 1-2 revisions average

### Phase 4
- Mock interview completion rate: 70%+
- User satisfaction with feedback: 4+/5

## Next Steps

**Immediate (Today):**
1. ✅ Update WARP.md with complete vision
2. ⬜ Set up Gemini API credentials
3. ⬜ Create initial AI service layer

**This Week:**
1. ⬜ Implement AI Mentor Chat backend
2. ⬜ Update dashboard to consume real AI responses
3. ⬜ Create conversation history database schema

**Next Week:**
1. ⬜ Build career assessment quiz
2. ⬜ Integrate AI career path analysis
3. ⬜ Update onboarding flow

## Resources & Documentation

### Gemini API
- [Official Documentation](https://ai.google.dev/docs)
- [Node.js SDK](https://github.com/google/generative-ai-js)
- [Prompt Engineering Guide](https://ai.google.dev/docs/prompt_best_practices)

### Code Execution
- [WebContainers](https://webcontainers.io/)
- [Judge0](https://judge0.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

### Learning Management Systems (Reference)
- [Duolingo Architecture](https://blog.duolingo.com/)
- [Khan Academy Engineering](https://blog.khanacademy.org/)
- [Codecademy Technical Blog](https://www.codecademy.com/resources/blog/)
