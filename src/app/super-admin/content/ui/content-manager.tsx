"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Course = {
  id: string;
  trackId: string;
  name: string;
  description: string | null;
  modules: any;
};

type Track = {
  id: string;
  name: string;
  description: string | null;
  courses: Course[];
};

type Props = {
  initialTracks: Track[];
};

export function ContentManager({ initialTracks }: Props) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [saving, setSaving] = useState(false);

  const [trackForm, setTrackForm] = useState<{ id?: string; name: string; description: string }>({
    name: "",
    description: "",
  });
  const [courseForm, setCourseForm] = useState<{
    id?: string;
    trackId: string;
    name: string;
    description: string;
    modulesText: string;
  }>({
    trackId: initialTracks[0]?.id ?? "",
    name: "",
    description: "",
    modulesText: "",
  });

  const selectedTrackForCourse = useMemo(
    () => tracks.find((track) => track.id === courseForm.trackId),
    [courseForm.trackId, tracks],
  );

  const resetTrackForm = () =>
    setTrackForm({
      id: undefined,
      name: "",
      description: "",
    });

  const resetCourseForm = () =>
    setCourseForm({
      id: undefined,
      trackId: tracks[0]?.id ?? "",
      name: "",
      description: "",
      modulesText: "",
    });

  const handleSaveTrack = async () => {
    if (!trackForm.name.trim()) return;
    setSaving(true);

    try {
      if (trackForm.id) {
        const response = await fetch(`/api/admin/tracks/${trackForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trackForm.name,
            description: trackForm.description,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to update track");

        setTracks((prev) =>
          prev.map((track) => (track.id === data.track.id ? data.track : track)),
        );
      } else {
        const response = await fetch("/api/admin/tracks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trackForm.name,
            description: trackForm.description,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create track");

        setTracks((prev) => [data.track, ...prev]);
      }
      resetTrackForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!courseForm.trackId || !courseForm.name.trim()) return;
    setSaving(true);

    try {
      const payload = {
        trackId: courseForm.trackId,
        name: courseForm.name,
        description: courseForm.description,
        modules: courseForm.modulesText
          ? courseForm.modulesText.split("\n").map((item) => item.trim()).filter(Boolean)
          : null,
      };

      if (courseForm.id) {
        const response = await fetch(`/api/admin/courses/${courseForm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to update course");

        setTracks((prev) =>
          prev.map((track) =>
            track.id === courseForm.trackId
              ? {
                  ...track,
                  courses: track.courses.map((course) =>
                    course.id === data.course.id ? data.course : course,
                  ),
                }
              : track,
          ),
        );
      } else {
        const response = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create course");

        setTracks((prev) =>
          prev.map((track) =>
            track.id === courseForm.trackId
              ? { ...track, courses: [data.course, ...track.courses] }
              : track,
          ),
        );
      }
      resetCourseForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#1F3C88]/80">Super Admin · Content</p>
          <h1 className="text-3xl font-semibold text-[#1F3C88]">Tracks & Courses</h1>
          <p className="text-base text-slate-600">
            View, edit, and create curriculum content for learners.
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/super-admin" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#1F3C88]/70">
                Track
              </p>
              <h2 className="text-lg font-semibold text-[#1F3C88]">
                {trackForm.id ? "Edit track" : "Create track"}
              </h2>
            </div>
            {trackForm.id && (
              <Button variant="ghost" size="sm" onClick={resetTrackForm}>
                Cancel
              </Button>
            )}
          </div>
          <div className="mt-3 space-y-3">
            <Input
              placeholder="Track name"
              value={trackForm.name}
              onChange={(e) => setTrackForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              value={trackForm.description}
              onChange={(e) =>
                setTrackForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
            />
            <Button onClick={handleSaveTrack} disabled={saving} className="w-full">
              {trackForm.id ? "Save changes" : "Create track"}
            </Button>
          </div>
        </Card>

        <Card className="border-white/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#1F3C88]/70">
                Course
              </p>
              <h2 className="text-lg font-semibold text-[#1F3C88]">
                {courseForm.id ? "Edit course" : "Create course"}
              </h2>
            </div>
            {courseForm.id && (
              <Button variant="ghost" size="sm" onClick={resetCourseForm}>
                Cancel
              </Button>
            )}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="space-y-3">
              <Select
                value={courseForm.trackId}
                onValueChange={(value) =>
                  setCourseForm((prev) => ({
                    ...prev,
                    trackId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent>
                  {tracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Course name"
                value={courseForm.name}
                onChange={(e) =>
                  setCourseForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Textarea
                placeholder="Description"
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
              />
              <Textarea
                placeholder="Modules or lessons (one per line)"
                value={courseForm.modulesText}
                onChange={(e) =>
                  setCourseForm((prev) => ({ ...prev, modulesText: e.target.value }))
                }
                rows={4}
              />
              <Button onClick={handleSaveCourse} disabled={saving} className="w-full">
                {courseForm.id ? "Save changes" : "Create course"}
              </Button>
            </div>

            <ScrollArea className="h-[320px] rounded-md border border-slate-200">
              <div className="space-y-3 p-3">
                {(selectedTrackForCourse?.courses ?? []).map((course) => (
                  <div
                    key={course.id}
                    className="rounded-lg border border-white/60 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#1F3C88]">{course.name}</p>
                        <p className="text-sm text-slate-600">
                          {course.description || "No description"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCourseForm({
                            id: course.id,
                            trackId: course.trackId,
                            name: course.name,
                            description: course.description || "",
                            modulesText: Array.isArray(course.modules)
                              ? course.modules.join("\n")
                              : "",
                          })
                        }
                        className="inline-flex items-center gap-1 text-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                    {Array.isArray(course.modules) && course.modules.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-700">
                        {course.modules.map((module: any, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-full bg-slate-100 px-2 py-1"
                          >
                            {String(module)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {(selectedTrackForCourse?.courses ?? []).length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-600">
                    No courses yet for this track. Add one using the form.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>

      <Card className="border-white/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#1F3C88]/70">
              Overview
            </p>
            <h2 className="text-lg font-semibold text-[#1F3C88]">All tracks</h2>
            <p className="text-sm text-slate-600">
              View tracks, courses, and jump into user enrollments.
            </p>
          </div>
          <Button asChild>
            <Link href="/super-admin" className="inline-flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              User view
            </Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="rounded-lg border border-white/60 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1F3C88]">{track.name}</p>
                  <p className="text-sm text-slate-600">
                    {track.description || "No description"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setTrackForm({
                      id: track.id,
                      name: track.name,
                      description: track.description || "",
                    })
                  }
                  className="inline-flex items-center gap-1 text-slate-700"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {track.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-md border border-[#1F3C88]/10 bg-[#f1f5ff] px-3 py-2"
                  >
                    <p className="font-medium text-[#1F3C88]">{course.name}</p>
                    <p className="text-xs text-slate-600">
                      {course.description || "No description"}
                    </p>
                  </div>
                ))}
                {track.courses.length === 0 && (
                  <p className="text-xs text-slate-600">No courses yet.</p>
                )}
              </div>
            </div>
          ))}
          {tracks.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-600">
              No tracks created yet. Add your first track above.
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}
