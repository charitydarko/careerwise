/**
 * Voice Interaction Types
 * 
 * Type definitions for voice-first AI mentor interactions
 */

import type { CareerTrack, ConversationContext } from "./ai";

// ============================================================================
// Voice Profile Types
// ============================================================================

export interface VoiceProfile {
  id: string;
  name: string;
  careerTrack: CareerTrack;
  geminiVoiceId: string; // Gemini TTS voice ID
  pitch: number; // 0.5 - 2.0
  speed: number; // 0.8 - 1.2
  style: "friendly" | "professional" | "enthusiastic" | "calm";
  description: string;
}

// ============================================================================
// Audio Processing Types
// ============================================================================

export interface AudioConfig {
  sampleRate: number; // 16000, 24000, 48000
  channels: number; // 1 (mono) or 2 (stereo)
  format: "webm" | "wav" | "mp3" | "ogg";
  mimeType: string; // e.g., "audio/webm;codecs=opus"
}

export interface AudioChunk {
  data: Blob | ArrayBuffer;
  timestamp: number;
  duration: number; // milliseconds
  sequenceNumber: number;
}

export interface AudioBuffer {
  data: ArrayBuffer;
  format: string;
  sampleRate: number;
  duration: number; // seconds
}

// ============================================================================
// Speech-to-Text Types
// ============================================================================

export interface TranscriptionRequest {
  audio: Blob | ArrayBuffer;
  format: "webm" | "wav" | "mp3";
  language: string; // e.g., "en-US"
  context?: string; // Additional context for better transcription
}

export interface TranscriptionResult {
  transcript: string;
  confidence: number; // 0-1
  language: string;
  duration: number; // milliseconds
  words?: Array<{
    word: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
}

export interface TranscriptionOptions {
  enableWordTimestamps?: boolean;
  profanityFilter?: boolean;
  punctuation?: boolean;
  model?: "default" | "enhanced";
}

// ============================================================================
// Text-to-Speech Types
// ============================================================================

export interface SynthesisRequest {
  text: string;
  voice: VoiceProfile;
  options?: SynthesisOptions;
}

export interface SynthesisOptions {
  speed?: number; // 0.25 - 4.0
  pitch?: number; // -20 to 20 semitones
  volumeGainDb?: number; // -96 to 16
  audioEncoding?: "MP3" | "LINEAR16" | "OGG_OPUS";
  sampleRateHertz?: number;
}

export interface SynthesisResult {
  audio: ArrayBuffer;
  format: string;
  duration: number; // milliseconds
  text: string;
}

// ============================================================================
// Voice Conversation Types
// ============================================================================

export interface VoiceMessage {
  id: string;
  role: "user" | "mentor";
  transcript: string;
  audioUrl?: string;
  timestamp: Date;
  duration?: number; // milliseconds
  confidence?: number; // STT confidence for user messages
}

export interface VoiceConversation {
  id: string;
  userId: string;
  context: ConversationContext;
  messages: VoiceMessage[];
  state: VoiceConversationState;
  startedAt: Date;
  lastActivityAt: Date;
  metadata?: {
    totalDuration: number; // seconds
    averageResponseTime: number; // milliseconds
    interruptCount: number;
  };
}

export type VoiceConversationState =
  | "idle"
  | "listening"
  | "processing"
  | "speaking"
  | "paused"
  | "error";

// ============================================================================
// Voice Chat Request/Response Types
// ============================================================================

export interface VoiceChatRequest {
  audio: Blob | string; // Blob or base64 encoded audio
  conversationId?: string;
  context: ConversationContext;
  options?: {
    returnAudio?: boolean; // Return synthesized audio in response
    streamResponse?: boolean; // Stream the response
  };
}

export interface VoiceChatResponse {
  conversationId: string;
  userTranscript: string;
  mentorResponse: string;
  audioUrl?: string; // URL to synthesized audio
  audioData?: string; // Base64 encoded audio data
  duration: number; // milliseconds
  metadata: {
    transcriptionConfidence: number;
    processingTime: number;
    model: string;
  };
}

// ============================================================================
// Voice Activity Detection Types
// ============================================================================

export interface VADConfig {
  threshold: number; // 0-1, voice detection sensitivity
  minSpeechDuration: number; // milliseconds
  silenceDuration: number; // milliseconds to wait before marking end
  minNoiseLevel: number; // minimum audio level to consider
}

export interface VoiceActivityEvent {
  type: "speech_start" | "speech_end" | "noise" | "silence";
  timestamp: number;
  audioLevel: number; // 0-1
  confidence: number; // 0-1
}

export interface VADResult {
  isSpeaking: boolean;
  audioLevel: number;
  timestamp: number;
}

// ============================================================================
// Audio Visualization Types
// ============================================================================

export interface AudioVisualizationData {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  volume: number; // 0-1
  timestamp: number;
}

export interface WaveformConfig {
  barCount: number;
  barWidth: number;
  barGap: number;
  minHeight: number;
  maxHeight: number;
  smoothing: number; // 0-1
  colors: {
    active: string;
    inactive: string;
  };
}

// ============================================================================
// Voice UI State Types
// ============================================================================

export interface VoiceUIState {
  mode: "push-to-talk" | "continuous" | "text";
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  audioLevel: number; // 0-1
  error?: VoiceError;
  permissionsGranted: {
    microphone: boolean;
    autoplay: boolean;
  };
}

export interface VoiceError {
  code: string;
  message: string;
  recoverable: boolean;
  fallbackToText: boolean;
}

// ============================================================================
// Voice Settings Types
// ============================================================================

export interface VoiceSettings {
  preferredMode: "voice" | "text" | "auto";
  pushToTalk: boolean;
  autoPlayResponse: boolean;
  voiceSpeed: number; // 0.8 - 1.2
  microphoneDeviceId?: string;
  speakerDeviceId?: string;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  vadSensitivity: number; // 0-1
}

// ============================================================================
// Browser Audio API Types
// ============================================================================

export interface MediaDeviceInfo {
  deviceId: string;
  kind: "audioinput" | "audiooutput";
  label: string;
  groupId: string;
}

export interface AudioConstraints {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  sampleRate?: number;
  channelCount?: number;
}

// ============================================================================
// Voice Queue Types
// ============================================================================

export interface AudioQueueItem {
  id: string;
  audio: ArrayBuffer | Blob;
  transcript: string;
  priority: "high" | "normal" | "low";
  addedAt: Date;
  playedAt?: Date;
}

export interface AudioQueueState {
  items: AudioQueueItem[];
  currentItem?: AudioQueueItem;
  isPlaying: boolean;
  isPaused: boolean;
}

// ============================================================================
// Voice Metrics Types
// ============================================================================

export interface VoiceMetrics {
  conversationId: string;
  userSpeechDuration: number; // milliseconds
  mentorSpeechDuration: number; // milliseconds
  totalLatency: number; // milliseconds (user stops → mentor starts)
  transcriptionLatency: number; // milliseconds
  synthesisLatency: number; // milliseconds
  messageCount: number;
  averageConfidence: number; // 0-1
  errors: number;
}

// ============================================================================
// WebSocket Voice Streaming Types
// ============================================================================

export interface VoiceStreamConfig {
  chunkSize: number; // bytes
  bufferSize: number; // milliseconds
  reconnectAttempts: number;
  heartbeatInterval: number; // milliseconds
}

export interface VoiceStreamEvent {
  type:
    | "audio_chunk"
    | "transcript"
    | "response_start"
    | "response_chunk"
    | "response_end"
    | "error";
  data: unknown;
  timestamp: number;
  sequenceNumber: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export type AudioFormat = "webm" | "wav" | "mp3" | "ogg";
export type SampleRate = 8000 | 16000 | 24000 | 48000;
export type BitDepth = 8 | 16 | 24 | 32;

export interface AudioMetadata {
  format: AudioFormat;
  sampleRate: SampleRate;
  bitDepth: BitDepth;
  channels: number;
  duration: number; // seconds
  size: number; // bytes
}
