/**
 * Gemini AI Service Layer
 * 
 * Core service for interacting with Google's Gemini AI.
 * Provides client initialization, configuration, and helper functions.
 */

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import type { AIModelConfig, AIError } from "@/types/ai";
import { AIServiceError } from "@/types/ai";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Default model configurations for different use cases
 */
export const MODEL_CONFIGS = {
  // For precise, factual responses (feedback, assessment)
  PRECISE: {
    model: "gemini-2.0-flash",
    temperature: 0.3,
    maxOutputTokens: 2048,
    topP: 0.8,
    topK: 10,
  },
  // For balanced conversation (mentor chat, explanations)
  BALANCED: {
    model: "gemini-2.0-flash",
    temperature: 0.5,
    maxOutputTokens: 2048,
    topP: 0.9,
    topK: 20,
  },
  // For creative content generation (concept cards, paths)
  CREATIVE: {
    model: "gemini-2.0-flash",
    temperature: 0.7,
    maxOutputTokens: 4096,
    topP: 0.95,
    topK: 40,
  },
} as const satisfies Record<string, AIModelConfig>;

/**
 * Error codes for AI service errors
 */
export const AI_ERROR_CODES = {
  MISSING_API_KEY: "MISSING_API_KEY",
  INVALID_REQUEST: "INVALID_REQUEST",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  MODEL_UNAVAILABLE: "MODEL_UNAVAILABLE",
  GENERATION_FAILED: "GENERATION_FAILED",
  TIMEOUT: "TIMEOUT",
  UNKNOWN: "UNKNOWN",
} as const;

// ============================================================================
// Client Initialization
// ============================================================================

let geminiClient: GoogleGenerativeAI | null = null;

/**
 * Initialize the Gemini AI client
 * Throws an error if API key is not configured
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new AIServiceError({
        code: AI_ERROR_CODES.MISSING_API_KEY,
        message: "GEMINI_API_KEY environment variable is not set",
        retryable: false,
      });
    }

    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  return geminiClient;
}

/**
 * Get a configured Gemini model instance
 */
export function getGeminiModel(config: AIModelConfig): GenerativeModel {
  const client = getGeminiClient();
  
  return client.getGenerativeModel({
    model: config.model,
    generationConfig: {
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
      topP: config.topP,
      topK: config.topK,
    },
  });
}

// ============================================================================
// Core Generation Functions
// ============================================================================

/**
 * Generate text using Gemini with retry logic
 */
export async function generateText(
  prompt: string,
  config: AIModelConfig = MODEL_CONFIGS.BALANCED,
  options?: {
    retries?: number;
    timeout?: number;
  }
): Promise<string> {
  const maxRetries = options?.retries ?? 3;
  const timeout = options?.timeout ?? 30000; // 30 seconds
  
  let lastError: AIError | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const model = getGeminiModel(config);
      
      // Create promise with timeout
      const generatePromise = model.generateContent(prompt);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), timeout)
      );

      const result = await Promise.race([generatePromise, timeoutPromise]);
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      return text;
    } catch (error) {
      lastError = handleGeminiError(error);

      // Don't retry if error is not retryable
      if (!lastError.retryable) {
        throw new AIServiceError(lastError);
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        await sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  // All retries failed
  throw new AIServiceError(
    lastError ?? {
      code: AI_ERROR_CODES.UNKNOWN,
      message: "Failed to generate text after multiple retries",
      retryable: false,
    }
  );
}

/**
 * Generate structured JSON output using Gemini
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  config: AIModelConfig = MODEL_CONFIGS.PRECISE,
  options?: {
    retries?: number;
    timeout?: number;
  }
): Promise<T> {
  const enhancedPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, code blocks, or explanations. Just the raw JSON object.`;
  
  const response = await generateText(enhancedPrompt, config, options);
  
  try {
    // Remove markdown code blocks if present
    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    return JSON.parse(cleanedResponse) as T;
  } catch (error) {
    throw new AIServiceError({
      code: AI_ERROR_CODES.INVALID_REQUEST,
      message: `Failed to parse JSON response: ${error instanceof Error ? error.message : "Unknown error"}`,
      retryable: false,
      details: { response },
    });
  }
}

/**
 * Generate text with streaming support
 */
export async function* generateTextStream(
  prompt: string,
  config: AIModelConfig = MODEL_CONFIGS.BALANCED
): AsyncGenerator<string, void, unknown> {
  try {
    const model = getGeminiModel(config);
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    const aiError = handleGeminiError(error);
    throw new AIServiceError(aiError);
  }
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Convert Gemini errors to AIError format
 */
function handleGeminiError(error: unknown): AIError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Rate limit errors
    if (message.includes("rate limit") || message.includes("quota")) {
      return {
        code: AI_ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: "Rate limit exceeded. Please try again later.",
        retryable: true,
        details: { originalError: error.message },
      };
    }

    // Timeout errors
    if (message.includes("timeout")) {
      return {
        code: AI_ERROR_CODES.TIMEOUT,
        message: "Request timed out",
        retryable: true,
        details: { originalError: error.message },
      };
    }

    // Model unavailable
    if (message.includes("unavailable") || message.includes("503")) {
      return {
        code: AI_ERROR_CODES.MODEL_UNAVAILABLE,
        message: "AI model temporarily unavailable",
        retryable: true,
        details: { originalError: error.message },
      };
    }

    // Invalid request
    if (message.includes("invalid") || message.includes("400")) {
      return {
        code: AI_ERROR_CODES.INVALID_REQUEST,
        message: error.message,
        retryable: false,
        details: { originalError: error.message },
      };
    }
  }

  // Unknown error
  return {
    code: AI_ERROR_CODES.UNKNOWN,
    message: error instanceof Error ? error.message : "Unknown error occurred",
    retryable: true,
    details: { originalError: error },
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Count approximate tokens in text (rough estimate: 1 token ≈ 4 characters)
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Validate that response meets minimum quality standards
 */
export function validateResponse(text: string, minLength: number = 10): boolean {
  if (!text || text.trim().length < minLength) {
    return false;
  }
  
  // Check for common error patterns
  const errorPatterns = [
    /i (can't|cannot|am unable to)/i,
    /error/i,
    /invalid/i,
  ];
  
  return !errorPatterns.some((pattern) => pattern.test(text));
}

// ============================================================================
// Health Check
// ============================================================================

/**
 * Test if the Gemini API is accessible and working
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  latency: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    const response = await generateText(
      "Respond with only the word 'OK'",
      MODEL_CONFIGS.PRECISE,
      { retries: 1, timeout: 5000 }
    );

    const latency = Date.now() - startTime;
    const healthy = validateResponse(response);

    return { healthy, latency };
  } catch (error) {
    return {
      healthy: false,
      latency: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
