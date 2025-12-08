/**
 * Voice Service Layer
 * 
 * Handles speech-to-text, text-to-speech, and audio processing
 * using Gemini's voice capabilities
 */

import { getGeminiClient, MODEL_CONFIGS } from "./gemini";
import type {
  TranscriptionRequest,
  TranscriptionResult,
  SynthesisRequest,
  SynthesisResult,
  VoiceProfile,
  AudioConfig,
} from "@/types/voice";
import type { CareerTrack } from "@/types/ai";

// ============================================================================
// Voice Profiles
// ============================================================================

/**
 * Mentor voice profiles with unique characteristics
 */
export const MENTOR_VOICE_PROFILES: Record<CareerTrack, VoiceProfile> = {
  frontend: {
    id: "alex",
    name: "Alex",
    careerTrack: "frontend",
    geminiVoiceId: "en-US-Studio-O", // Energetic, friendly voice
    pitch: 1.1,
    speed: 1.05,
    style: "enthusiastic",
    description: "Energetic and creative, loves talking about UI and design",
  },
  data: {
    id: "spark",
    name: "Spark",
    careerTrack: "data",
    geminiVoiceId: "en-US-Studio-M", // Clear, analytical voice
    pitch: 1.0,
    speed: 1.0,
    style: "professional",
    description: "Analytical and precise, passionate about data insights",
  },
  cloud: {
    id: "cloud",
    name: "Cloud",
    careerTrack: "cloud",
    geminiVoiceId: "en-US-Wavenet-D", // Calm, reliable voice
    pitch: 0.9,
    speed: 0.95,
    style: "calm",
    description: "Pragmatic and systems-focused, speaks about infrastructure",
  },
  ux: {
    id: "luna",
    name: "Luna",
    careerTrack: "ux",
    geminiVoiceId: "en-US-Studio-O", // Warm, empathetic voice
    pitch: 1.05,
    speed: 1.0,
    style: "friendly",
    description: "Empathetic and user-focused, loves design thinking",
  },
  backend: {
    id: "core",
    name: "Core",
    careerTrack: "backend",
    geminiVoiceId: "en-US-Wavenet-A", // Professional, clear voice
    pitch: 0.95,
    speed: 1.0,
    style: "professional",
    description: "Logical and architecture-focused, speaks about systems",
  },
};

/**
 * Get voice profile for a career track
 */
export function getVoiceProfile(
  careerTrack?: CareerTrack | string,
): VoiceProfile {
  const key = (careerTrack || "").toLowerCase();
  const profile =
    MENTOR_VOICE_PROFILES[key as CareerTrack] ?? MENTOR_VOICE_PROFILES.frontend;

  // Preserve the requested track name to help with logging/consistency
  return {
    ...profile,
    careerTrack: (careerTrack as any) || profile.careerTrack,
  };
}

// ============================================================================
// Audio Configuration
// ============================================================================

/**
 * Default audio configuration for recording
 */
export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  sampleRate: 16000, // 16kHz is optimal for speech
  channels: 1, // Mono for voice
  format: "webm",
  mimeType: "audio/webm;codecs=opus",
};

/**
 * Get supported audio MIME types for the browser
 */
export function getSupportedMimeTypes(): string[] {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
    "audio/wav",
  ];

  return types.filter((type) => {
    if (typeof MediaRecorder === "undefined") return false;
    return MediaRecorder.isTypeSupported(type);
  });
}

/**
 * Get the best supported MIME type
 */
export function getBestMimeType(): string {
  const supported = getSupportedMimeTypes();
  return supported[0] || "audio/webm";
}

// ============================================================================
// Speech-to-Text (Transcription)
// ============================================================================

/**
 * Transcribe audio to text using Gemini
 */
export async function transcribeAudio(
  request: TranscriptionRequest
): Promise<TranscriptionResult> {
  const startTime = Date.now();

  try {
    const client = getGeminiClient();
    // Use gemini-2.0-flash for multimodal (audio) support
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // Convert audio to base64 if it's a Blob
    let audioData: string;
    if (request.audio instanceof Blob) {
      audioData = await blobToBase64(request.audio);
    } else {
      audioData = arrayBufferToBase64(request.audio);
    }

    // Remove data URL prefix if present (already base64)
    const base64Data = audioData.includes(",") ? audioData.split(",")[1] : audioData;

    console.log(`[Voice Service] Transcribing ${request.format} audio (${base64Data.length} chars)`);

    // Prepare the content with audio
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: `audio/${request.format}`,
          data: base64Data,
        },
      },
      {
        text: `Transcribe the audio to text. ${request.context ? `Context: ${request.context}` : ""} Return ONLY the transcribed text, nothing else.`,
      },
    ]);

    const response = result.response;
    const transcript = response.text().trim();

    const duration = Date.now() - startTime;

    return {
      transcript,
      confidence: 0.9, // Gemini doesn't provide confidence, use default
      language: request.language,
      duration,
    };
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error(
      `Failed to transcribe audio: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ============================================================================
// Text-to-Speech (Synthesis)
// ============================================================================

/**
 * Synthesize speech from text using Gemini
 * Note: This is a placeholder - actual TTS implementation depends on Gemini's voice API availability
 */
export async function synthesizeSpeech(
  request: SynthesisRequest
): Promise<SynthesisResult> {
  // TODO: Replace with actual Gemini TTS API when available
  // For now, we'll use browser's Web Speech API as fallback
  return synthesizeSpeechBrowser(request);
}

/**
 * Synthesize speech using browser's Web Speech API (fallback)
 */
async function synthesizeSpeechBrowser(
  request: SynthesisRequest
): Promise<SynthesisResult> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    throw new Error("Speech synthesis not supported in this environment");
  }

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(request.text);

    // Apply voice settings
    utterance.rate = request.options?.speed || request.voice.speed;
    utterance.pitch = request.voice.pitch;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang === "en-US") || voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    // Capture audio (not directly possible with Web Speech API)
    // This is a limitation - actual implementation would need server-side TTS
    utterance.onend = () => {
      resolve({
        audio: new ArrayBuffer(0), // Placeholder
        format: "audio/wav",
        duration: request.text.length * 50, // Rough estimate
        text: request.text,
      });
    };

    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis failed: ${event.error}`));
    };

    window.speechSynthesis.speak(utterance);
  });
}

// ============================================================================
// Audio Utilities
// ============================================================================

/**
 * Convert Blob to base64 string
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert ArrayBuffer to base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Blob
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Estimate audio duration from file size (rough approximation)
 */
export function estimateAudioDuration(sizeBytes: number, bitrate: number = 128000): number {
  // duration in seconds = (file size in bytes * 8) / bitrate
  return (sizeBytes * 8) / bitrate;
}

// ============================================================================
// Microphone Access
// ============================================================================

/**
 * Request microphone access
 */
export async function requestMicrophoneAccess(
  constraints?: MediaStreamConstraints
): Promise<MediaStream> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices) {
    throw new Error("Media devices not supported in this environment");
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: constraints?.audio || {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
      },
      video: false,
    });

    return stream;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        throw new Error("Microphone access denied. Please allow microphone access to use voice features.");
      } else if (error.name === "NotFoundError") {
        throw new Error("No microphone found. Please connect a microphone to use voice features.");
      }
    }
    throw new Error("Failed to access microphone");
  }
}

/**
 * Check if microphone permission is granted
 */
export async function checkMicrophonePermission(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return false;
  }

  try {
    const result = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return result.state === "granted";
  } catch {
    return false;
  }
}

/**
 * Get available audio input devices
 */
export async function getAudioInputDevices(): Promise<MediaDeviceInfo[]> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput");
  } catch {
    return [];
  }
}

// ============================================================================
// Audio Recording
// ============================================================================

/**
 * Create a MediaRecorder for audio recording
 */
export function createAudioRecorder(
  stream: MediaStream,
  onDataAvailable: (chunk: Blob) => void,
  config: AudioConfig = DEFAULT_AUDIO_CONFIG
): MediaRecorder {
  const mimeType = getBestMimeType();

  const recorder = new MediaRecorder(stream, {
    mimeType,
    audioBitsPerSecond: 128000,
  });

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      onDataAvailable(event.data);
    }
  };

  return recorder;
}

/**
 * Record audio for a specific duration
 */
export async function recordAudio(
  durationMs: number,
  config: AudioConfig = DEFAULT_AUDIO_CONFIG
): Promise<Blob> {
  const stream = await requestMicrophoneAccess();
  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    const recorder = createAudioRecorder(
      stream,
      (chunk) => chunks.push(chunk),
      config
    );

    recorder.start();

    setTimeout(() => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());

      const blob = new Blob(chunks, { type: getBestMimeType() });
      resolve(blob);
    }, durationMs);

    recorder.onerror = (event) => {
      stream.getTracks().forEach((track) => track.stop());
      reject(new Error("Recording failed"));
    };
  });
}

// ============================================================================
// Voice Activity Detection (Simple)
// ============================================================================

/**
 * Simple voice activity detection based on audio level
 */
export class SimpleVoiceActivityDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private rafId: number | null = null;
  private threshold: number;
  private onActivity: ((level: number) => void) | null = null;

  constructor(threshold: number = 0.1) {
    this.threshold = threshold;
  }

  start(stream: MediaStream, onActivity: (level: number) => void): void {
    this.onActivity = onActivity;

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    source.connect(this.analyser);

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;

    this.detectActivity();
  }

  private detectActivity(): void {
    if (!this.analyser || !this.dataArray) return;

    this.analyser.getByteTimeDomainData(this.dataArray);

    // Calculate audio level
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = (this.dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / this.dataArray.length);

    if (this.onActivity) {
      this.onActivity(rms);
    }

    this.rafId = requestAnimationFrame(() => this.detectActivity());
  }

  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.dataArray = null;
    this.onActivity = null;
  }
}
