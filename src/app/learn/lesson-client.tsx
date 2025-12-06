"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LessonViewer } from "@/components/lesson/lesson-viewer";
import type {
  CareerTrack,
  LearningLevel,
  LessonGenerationResponse,
} from "@/types/ai";

type LessonGeneratorClientProps = {
  topic: string;
  difficulty: LearningLevel;
  careerTrack: CareerTrack;
  estimatedMinutes?: number;
  resourceUrl?: string;
};

export function LessonGeneratorClient({
  topic,
  difficulty,
  careerTrack,
  estimatedMinutes,
  resourceUrl,
}: LessonGeneratorClientProps) {
  const [lesson, setLesson] = useState<LessonGenerationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLesson = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          careerTrack,
          estimatedMinutes,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate lesson");
      }

      const data = (await response.json()) as LessonGenerationResponse;
      setLesson(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to generate lesson";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [topic, difficulty, careerTrack, estimatedMinutes]);

  useEffect(() => {
    generateLesson();
  }, [generateLesson]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            AI lesson (beta)
          </div>
          <p className="text-sm text-muted-foreground">
            Generates in-platform guidance so learners don't have to leave the dashboard.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateLesson}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Regenerate"}
        </Button>
      </div>

      <LessonViewer
        lesson={lesson}
        isLoading={isLoading}
        error={error}
        onRetry={generateLesson}
        resourceUrl={resourceUrl}
      />
    </div>
  );
}
