# Voice-First AI Mentor Architecture

**Priority:** Voice interaction is PRIMARY, text chat is SECONDARY (fallback/accessibility)

## Voice Interaction Flow

```
User speaks → Speech-to-Text → Gemini AI → Text-to-Speech → Audio output
                    ↓                              ↓
              Text transcript              Text transcript
              (for review)                 (for accessibility)
```

## Architecture Layers

### 1. Voice Input Layer (Browser → Server)

**Components:**
- `MediaRecorder API` - Capture audio from microphone
- `Web Speech API (SpeechRecognition)` - Browser-native speech-to-text (fallback)
- `Gemini Voice Models` - Server-side speech-to-text (primary)

**Flow:**
```typescript
// Browser
1. User clicks "Push to Talk" or enables continuous listening
2. Capture audio stream from microphone
3. Send audio chunks to server (WebSocket or HTTP streaming)
4. Display visual feedback (waveform, voice activity)

// Server
5. Process audio with Gemini voice models
6. Convert speech to text
7. Send transcript back to client for display
```

### 2. AI Processing Layer (Server)

**Components:**
- `Gemini AI` - Core intelligence
- `Context Management` - Conversation history + learning state
- `Prompt Engineering` - Voice-optimized prompts

**Flow:**
```typescript
1. Receive transcript from speech-to-text
2. Load conversation context + learning state
3. Build voice-optimized prompt (shorter, more conversational)
4. Generate AI response (optimized for speech)
5. Return text response for TTS
```

### 3. Voice Output Layer (Server → Browser)

**Components:**
- `Gemini Voice Models` - Server-side text-to-speech (primary)
- `Web Speech API (SpeechSynthesis)` - Browser-native TTS (fallback)
- `Audio Context API` - Advanced audio playback control

**Flow:**
```typescript
// Server
1. Generate AI response text
2. Convert to speech using Gemini voice models
3. Stream audio back to client

// Browser
4. Receive audio stream
5. Play audio through speakers
6. Display synchronized text transcript
7. Show visual feedback (audio bars, avatar animation)
```

## Technical Implementation

### Phase 1: Voice-First Foundation

#### 1.1 Voice Input Component
**File:** `src/components/voice/voice-input.tsx`

```typescript
interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError: (error: Error) => void;
  enabled: boolean;
}

// Features:
- Push-to-talk button
- Continuous listening mode
- Visual audio level indicator
- Real-time transcript display
- Browser permission handling
```

#### 1.2 Voice API Endpoints
**Files:**
- `src/app/api/voice/transcribe/route.ts` - Audio → Text
- `src/app/api/voice/synthesize/route.ts` - Text → Audio
- `src/app/api/voice/chat/route.ts` - Complete voice conversation

```typescript
// POST /api/voice/transcribe
{
  audio: Blob | AudioBuffer,
  format: "webm" | "wav" | "mp3",
  language: "en-US"
}
→ { transcript: string, confidence: number }

// POST /api/voice/synthesize
{
  text: string,
  voice: "Alex" | "Spark" | "Cloud" | "Luna" | "Core",
  speed: number (0.8 - 1.2)
}
→ Audio stream

// POST /api/voice/chat (combines both)
{
  audio: Blob,
  context: ConversationContext
}
→ { 
  transcript: string,
  response: string,
  audioUrl: string
}
```

#### 1.3 Voice Service Layer
**File:** `src/lib/voice-service.ts`

```typescript
// Speech-to-Text
async function transcribeAudio(
  audioBlob: Blob,
  options?: TranscriptionOptions
): Promise<TranscriptionResult>

// Text-to-Speech
async function synthesizeSpeech(
  text: string,
  voice: VoiceProfile,
  options?: SynthesisOptions
): Promise<AudioBuffer>

// Voice Activity Detection
function detectVoiceActivity(
  audioStream: MediaStream
): Observable<VoiceActivityEvent>
```

### Phase 2: Enhanced Voice Features

#### 2.1 Voice Profiles
**File:** `src/lib/voice-profiles.ts`

Each mentor persona has unique voice characteristics:

```typescript
interface VoiceProfile {
  id: string;
  name: string;
  geminiVoiceId: string; // Gemini voice model ID
  pitch: number;         // 0.5 - 2.0
  speed: number;         // 0.8 - 1.2
  style: "friendly" | "professional" | "enthusiastic" | "calm";
}

const MENTOR_VOICES: Record<CareerTrack, VoiceProfile> = {
  frontend: {
    id: "alex",
    name: "Alex",
    geminiVoiceId: "en-US-Studio-O", // Energetic voice
    pitch: 1.1,
    speed: 1.05,
    style: "enthusiastic"
  },
  data: {
    id: "spark",
    name: "Spark", 
    geminiVoiceId: "en-US-Studio-M", // Clear, analytical
    pitch: 1.0,
    speed: 1.0,
    style: "professional"
  },
  // ... etc
};
```

#### 2.2 Conversation State Management
**File:** `src/lib/voice-conversation.ts`

```typescript
interface VoiceConversation {
  id: string;
  userId: string;
  messages: VoiceMessage[];
  state: "idle" | "listening" | "processing" | "speaking";
  audioQueueItems: AudioQueueItem[];
}

interface VoiceMessage {
  id: string;
  role: "user" | "mentor";
  transcript: string;
  audioUrl?: string;
  timestamp: Date;
  duration?: number; // milliseconds
}

// Queue management for smooth audio playback
class AudioQueue {
  async enqueue(audio: AudioBuffer): Promise<void>
  async play(): Promise<void>
  pause(): void
  clear(): void
}
```

#### 2.3 Voice-Optimized Prompts
**File:** `src/lib/voice-prompts.ts`

```typescript
/**
 * Voice responses should be:
 * - Shorter (2-3 sentences max)
 * - More conversational
 * - Include natural pauses
 * - Avoid complex formatting
 */
function buildVoiceSystemPrompt(context: ConversationContext): string {
  return `You are ${persona.name}, speaking to a learner via voice.

VOICE COMMUNICATION RULES:
- Keep responses SHORT (2-3 sentences max)
- Use natural, conversational language
- Speak as if having a face-to-face conversation
- Use pauses naturally (add commas and periods)
- Avoid complex jargon unless necessary
- Ask ONE question at a time
- Be warm and encouraging
- NO emojis (voice only)
- NO formatting (bullet points, code blocks, etc.)

Example good response:
"Great question! Let me explain that simply. React hooks let you use state in function components, which makes your code cleaner and easier to read. Want to try an example?"

Example bad response:
"React hooks are a feature that enables... [long paragraph] ...Here are 5 key points: 1. State management 2. Side effects..."

CURRENT CONTEXT:
${buildContextSummary(context)}`;
}
```

### Phase 3: Real-time Voice Streaming

#### 3.1 WebSocket Implementation
**File:** `src/app/api/voice/stream/route.ts`

```typescript
// Real-time bidirectional voice communication
import { Server } from "socket.io";

// Client → Server: Audio chunks
socket.on("audio-chunk", async (chunk: ArrayBuffer) => {
  // Stream to Gemini for transcription
  // Accumulate until silence detected
});

// Server → Client: Audio response chunks
socket.emit("audio-response", audioChunk);

// Benefits:
// - Lower latency (no HTTP overhead)
// - Continuous conversation
// - Interrupt capability
// - Real-time feedback
```

#### 3.2 Voice Activity Detection (VAD)
**File:** `src/lib/voice-activity-detection.ts`

```typescript
/**
 * Detect when user starts/stops speaking
 * Enables:
 * - Automatic speech segmentation
 * - Natural turn-taking
 * - Interrupt detection
 */
class VoiceActivityDetector {
  constructor(
    audioStream: MediaStream,
    options: VADOptions
  )
  
  onSpeechStart: () => void
  onSpeechEnd: () => void
  onVolumeChange: (level: number) => void
}

// Settings
interface VADOptions {
  threshold: number;        // 0-1, voice detection sensitivity
  minSpeechDuration: number; // ms, ignore short bursts
  silenceDuration: number;   // ms, wait before marking end
}
```

## Database Schema (Voice-Specific)

```prisma
model VoiceConversation {
  id              String   @id @default(cuid())
  userId          String
  careerTrack     String
  startedAt       DateTime @default(now())
  endedAt         DateTime?
  totalDuration   Int      // seconds
  messageCount    Int
  audioStorageUrl String?  // S3/Blob storage
  
  messages        VoiceMessage[]
}

model VoiceMessage {
  id              String   @id @default(cuid())
  conversationId  String
  role            String   // "user" | "mentor"
  transcript      String
  audioUrl        String?
  duration        Int      // milliseconds
  confidence      Float?   // STT confidence
  timestamp       DateTime @default(now())
  
  conversation    VoiceConversation @relation(fields: [conversationId], references: [id])
}

model VoiceSettings {
  userId          String   @id
  preferredMode   String   // "voice" | "text" | "auto"
  autoPlayResponse Boolean @default(true)
  voiceSpeed      Float    @default(1.0)
  microphoneId    String?
  speakerId       String?
}
```

## UI/UX Components

### Voice Interaction Panel
**File:** `src/components/voice/voice-panel.tsx`

```
┌─────────────────────────────────────┐
│  🎙️  AI Mentor Voice Chat          │
├─────────────────────────────────────┤
│                                     │
│  [Animated Avatar - Speaking]       │
│                                     │
│  Transcript:                        │
│  "Let's talk about React hooks.     │
│   What would you like to know?"     │
│                                     │
├─────────────────────────────────────┤
│  [●●●●● Audio Waveform ●●●●●]      │
│                                     │
│  [ 🎤 Push to Talk ]  [ ⏸️ Pause ] │
│  [ 💬 Switch to Text ]              │
│                                     │
│  ⚙️ Voice Settings                  │
│   • Speech speed: [====|=====] 1.0x │
│   • Auto-play: ✓ Enabled            │
│   • Mic: Built-in (Active)          │
└─────────────────────────────────────┘
```

### Visual Feedback Elements

1. **Audio Waveform**
   - Real-time visualization during recording
   - Animated bars showing voice activity

2. **Avatar Animation**
   - Idle state (breathing animation)
   - Listening state (pulsing)
   - Speaking state (mouth movement)

3. **Transcript Display**
   - Real-time transcript as AI speaks
   - Scrollable history
   - Highlight current phrase

4. **Status Indicators**
   - 🔴 Recording
   - 🔵 Processing
   - 🟢 Speaking
   - ⚪ Idle

## Voice Quality Considerations

### 1. Latency Optimization
- Target: <2 seconds from user speech end to AI response start
- Strategies:
  - Stream audio chunks (don't wait for complete recording)
  - Pre-cache common responses
  - Use Gemini streaming for faster TTFB
  - Parallel STT + AI processing when possible

### 2. Audio Quality
- **Input:** Noise cancellation, echo reduction
- **Output:** Clear, natural-sounding speech
- **Fallbacks:** Multiple TTS providers (Gemini → Web Speech API)

### 3. Error Handling
```typescript
// Graceful degradation
if (voiceNotSupported) {
  // Fall back to text chat
  showTextChatUI();
}

if (microphonePermissionDenied) {
  // Explain need for microphone
  // Offer text alternative
}

if (audioProcessingFailed) {
  // Show error, allow retry
  // Don't lose conversation context
}
```

## Implementation Priority

### Sprint 1: Core Voice Infrastructure (Week 1-2)
1. ✅ Voice input capture (browser)
2. ✅ Speech-to-text API endpoint
3. ✅ Voice-optimized prompts
4. ✅ Text-to-speech API endpoint
5. ✅ Basic voice UI component

### Sprint 2: Voice Integration (Week 2-3)
1. ✅ Connect voice panel to dashboard
2. ✅ Conversation history storage
3. ✅ Voice profile implementation
4. ✅ Audio playback queue

### Sprint 3: Enhanced Features (Week 3-4)
1. ✅ Real-time streaming (WebSocket)
2. ✅ Voice activity detection
3. ✅ Avatar animations
4. ✅ Voice settings panel

### Sprint 4: Polish & Optimization (Week 4+)
1. ✅ Latency optimization
2. ✅ Audio quality improvements
3. ✅ Mobile optimization
4. ✅ Accessibility features

## Testing Strategy

### 1. Audio Testing
- Test across different browsers (Chrome, Firefox, Safari)
- Test with different microphones
- Test in noisy environments
- Test audio playback quality

### 2. Conversation Testing
- Test turn-taking (user interrupts AI)
- Test long conversations (context retention)
- Test error recovery
- Test fallback to text mode

### 3. Performance Testing
- Measure end-to-end latency
- Test WebSocket stability
- Monitor audio buffer memory usage
- Test concurrent voice sessions

## Gemini Voice Capabilities

### Available Models (as of Dec 2024)
- **Gemini Pro with Audio** - Speech understanding + generation
- **Gemini 1.5 Flash** - Faster processing, lower latency
- **Gemini 2.0 (upcoming)** - Native voice conversations

### API Endpoints
```typescript
// Send audio directly to Gemini
const result = await model.generateContent([
  {
    inlineData: {
      mimeType: "audio/wav",
      data: audioBase64
    }
  },
  { text: systemPrompt }
]);

// Get audio response
const audioResponse = await model.generateAudio(responseText, {
  voice: "en-US-Studio-O",
  pitch: 1.0,
  speed: 1.0
});
```

## Next Steps

1. **Set up audio capture** - Implement microphone access and recording
2. **Build voice API endpoints** - Create STT and TTS routes
3. **Create voice UI component** - Build interactive voice panel
4. **Test with Gemini voice models** - Validate audio quality and latency
5. **Integrate with dashboard** - Replace text chat with voice-first UI

---

**Goal:** Natural, real-time voice conversations that feel like talking to a real mentor, with text chat as a convenient fallback for silent environments.
