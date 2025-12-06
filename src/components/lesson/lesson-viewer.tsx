"use client";

import { ExternalLink, RefreshCw, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LessonGenerationResponse } from "@/types/ai";

type LessonViewerProps = {
  lesson: LessonGenerationResponse | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  resourceUrl?: string;
};

export function LessonViewer({
  lesson,
  isLoading,
  error,
  onRetry,
  resourceUrl,
}: LessonViewerProps) {
  if (isLoading) {
    return <LessonSkeleton />;
  }

  if (error) {
    return (
      <Card className="space-y-3 border-destructive/30 bg-destructive/5 p-6">
        <div className="text-lg font-semibold text-destructive">Lesson generation failed</div>
        <p className="text-sm text-muted-foreground">
          {error || "We couldn't generate this lesson. Please try again."}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry generation
          </Button>
        )}
      </Card>
    );
  }

  if (!lesson) {
    return (
      <Card className="space-y-3 p-6">
        <div className="text-lg font-semibold">No lesson yet</div>
        <p className="text-sm text-muted-foreground">
          Generate a lesson to get in-platform guidance for this task.
        </p>
        {resourceUrl && (
          <a
            href={resourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Open external resource
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              AI-generated lesson
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">{lesson.title}</h2>
            <p className="text-sm text-muted-foreground">{lesson.overview}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4" />
            {lesson.estimatedMinutes} min
          </div>
        </div>
      </Card>

      <Card className="space-y-6 p-6">
        <div className="space-y-4">
          {lesson.sections.map((section) => (
            <div key={section.heading} className="space-y-2">
              <h3 className="text-lg font-semibold">{section.heading}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {lesson.codeExamples.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-semibold uppercase text-muted-foreground">
              Code examples
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.codeExamples.map((example) => (
                <div
                  key={example.title}
                  className="rounded-xl border bg-muted/50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>{example.title}</span>
                    <span className="rounded-full bg-background px-2 py-0.5 text-[11px] uppercase tracking-wide">
                      {example.language}
                    </span>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs leading-relaxed">
                    <code>{example.code}</code>
                  </pre>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {example.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {lesson.keyTakeaways.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase text-muted-foreground">
              Key takeaways
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {lesson.keyTakeaways.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {lesson.practice && (
          <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="text-sm font-semibold uppercase text-primary">
              Practice
            </div>
            <div className="text-sm font-medium text-foreground">
              {lesson.practice.prompt}
            </div>
            {lesson.practice.steps?.length ? (
              <ol className="ml-4 space-y-2 text-sm text-muted-foreground">
                {lesson.practice.steps.map((step, index) => (
                  <li key={`${step}-${index}`} className="list-decimal">
                    {step}
                  </li>
                ))}
              </ol>
            ) : null}
            {lesson.practice.expectedOutcome && (
              <p className="text-sm text-muted-foreground">
                Expected outcome: {lesson.practice.expectedOutcome}
              </p>
            )}
          </div>
        )}

        {resourceUrl && (
          <div className="flex items-center justify-between rounded-lg border bg-background p-3 text-sm">
            <div className="text-muted-foreground">
              Want to compare with the original resource?
            </div>
            <a
              href={resourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              Open resource
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <Card className="space-y-4 p-6">
      <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="space-y-2 rounded-lg border p-3">
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-16 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </Card>
  );
}
