import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function SuperAdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  if (!userId || typeof userId !== "string") {
    notFound();
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        enrollments: {
          include: {
            track: true,
            course: true,
          },
          orderBy: { enrollmentDate: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("[SUPER_ADMIN_USER_DETAIL]", error);
    notFound();
  }

  if (!user) {
    notFound();
  }

  const availableTracks = await prisma.track.findMany({
    include: { courses: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#1F3C88]/80">Super Admin · User details</p>
          <h1 className="text-3xl font-semibold text-[#1F3C88]">
            {user.name || "Unnamed user"}
          </h1>
          <p className="text-base text-slate-600">{user.email}</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/super-admin" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur">
          <h2 className="text-lg font-semibold text-[#1F3C88]">
            Personal details
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-700">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium text-slate-900">{user.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Sign-up date</dt>
              <dd className="font-medium text-slate-900">
                {new Date(user.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Role</dt>
              <dd className="font-medium text-slate-900">
                {user.isSuperAdmin ? "Super Admin" : "User"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Career track</dt>
              <dd className="font-medium text-slate-900">
                {user.profile?.careerTrack || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Learning level</dt>
              <dd className="font-medium text-slate-900">
                {user.profile?.learningLevel || "—"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="border-white/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1F3C88]">
                Available tracks & courses
              </h2>
              <p className="text-sm text-slate-600">
                Quick snapshot of what can be assigned.
              </p>
            </div>
            <Button variant="outline" asChild size="sm">
              <Link href="/super-admin/content" className="inline-flex gap-2">
                Manage content
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {availableTracks.map((track) => (
              <div
                key={track.id}
                className="rounded-lg border border-white/60 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1F3C88]">{track.name}</p>
                    <p className="text-sm text-slate-600">
                      {track.description || "No description"}
                    </p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    {track.courses.length} courses
                  </p>
                </div>
                {track.courses.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-700">
                    {track.courses.map((course) => (
                      <span
                        key={course.id}
                        className="rounded-full bg-slate-100 px-3 py-1"
                      >
                        {course.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {availableTracks.length === 0 && (
              <p className="text-sm text-slate-600">
                No tracks created yet. Add one in Content Management.
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="border-white/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur">
        <h2 className="text-lg font-semibold text-[#1F3C88]">
          Enrolled tracks & courses
        </h2>
        <p className="text-sm text-slate-600">
          Enrollment date and current progress per learner.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Track
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Course
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Enrollment date
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {user.enrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-3 text-slate-900">
                    {enrollment.track?.name || "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-900">
                    {enrollment.course?.name || "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 text-slate-900">
                    {enrollment.progress}%
                  </td>
                </tr>
              ))}
              {user.enrollments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-slate-600"
                  >
                    Not enrolled in any track or course yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
