/**
 * Voice Panel V2 - Using browser Speech Recognition API
 * Simpler and more reliable than Gemini audio transcription
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getVoiceProfile } from "@/lib/voice-service";
import type { ConversationContext } from "@/types/ai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface VoicePanelV2Props {
  context: ConversationContext;
  onModeSwitch?: () => void;
}

// Declare Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoicePanelV2({ context, onModeSwitch }: VoicePanelV2Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const recognitionRef = useRef<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const voiceProfile = getVoiceProfile(context.careerTrack);

  // Check if Speech Recognition is available
  const isSpeechRecognitionAvailable = 
    typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Load conversation history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch('/api/conversations?limit=20');
        if (response.ok) {
          const data = await response.json();
          const formattedMessages: Message[] = data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(formattedMessages);
          console.log(`[Voice] Loaded ${formattedMessages.length} messages from history`);
        }
      } catch (err) {
        console.error('[Voice] Failed to load history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isSpeechRecognitionAvailable) {
      setError("Speech recognition not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('[Voice] Transcribed:', transcript);
      
      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content: transcript,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      await getAIResponse(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('[Voice] Recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log('[Voice] Recognition ended');
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSpeechRecognitionAvailable]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const startRecording = () => {
    if (!recognitionRef.current) return;

    setError(null);
    setIsRecording(true);
    
    try {
      recognitionRef.current.start();
      console.log('[Voice] Started recording');
    } catch (err) {
      console.error('[Voice] Failed to start:', err);
      setError("Failed to start recording");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      console.log('[Voice] Stopped recording');
    } catch (err) {
      console.error('[Voice] Failed to stop:', err);
    }
    
    setIsRecording(false);
  };

  const getAIResponse = async (userMessage: string) => {
    setIsProcessing(true);

    try {
      // Call text-based API (not voice API)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context,
          conversationHistory: messages.slice(-5),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      const aiResponse = data.response;

      // Add AI message
      const aiMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Speak the response
      await speakText(aiResponse);

    } catch (err) {
      console.error('[Voice] AI response error:', err);
      setError(err instanceof Error ? err.message : "Failed to get AI response");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = voiceProfile.speed;
      utterance.pitch = voiceProfile.pitch;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('[Voice] TTS error:', event);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  if (!isSpeechRecognitionAvailable) {
    return (
      <Card className="flex flex-col h-full p-6 bg-red-50 border-red-200">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>Speech recognition not available. Please use Chrome, Edge, or Safari.</p>
        </div>
        {onModeSwitch && (
          <Button onClick={onModeSwitch} variant="outline" className="mt-4">
            Switch to Text Chat
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"
          )} />
          <h3 className="font-semibold">Voice Chat with {voiceProfile.name}</h3>
        </div>
        {onModeSwitch && (
          <Button onClick={onModeSwitch} variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Text Mode
          </Button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory && (
          <div className="text-center text-gray-500 mt-8">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            <p className="text-sm mt-2">Loading conversation history...</p>
          </div>
        )}
        
        {!isLoadingHistory && messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Hold the button below and start speaking</p>
            <p className="text-sm mt-2">Release to send your message</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2",
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              )}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Status indicators */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        {isSpeaking && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1 h-4 bg-blue-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm">Speaking...</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Record button */}
      <div className="p-6 border-t">
        <div className="flex flex-col items-center gap-3">
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={isProcessing || isSpeaking}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all",
              "focus:outline-none focus:ring-4 focus:ring-offset-2",
              isRecording
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-300 scale-110"
                : "bg-green-500 hover:bg-green-600 focus:ring-green-300",
              (isProcessing || isSpeaking) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isRecording ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </button>

          <p className="text-sm text-gray-600">
            {isRecording ? "Release to send" : "Hold to speak"}
          </p>
        </div>
      </div>
    </Card>
  );
}
