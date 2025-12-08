import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SuperAdminHomePage() {
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-[#1F3C88]/80">CareerWise · Super Admin</p>
          <h1 className="text-3xl font-semibold text-[#1F3C88]">
            Control Center
          </h1>
          <p className="text-base text-slate-600">
            Manage users, view enrollment details, and curate tracks and courses.
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#1F3C88]/70">
                Users
              </p>
              <p className="text-3xl font-semibold text-[#1F3C88]">
                {users.length}
              </p>
              <p className="text-sm text-slate-500">Total accounts</p>
            </div>
            <Button asChild>
              <Link
                href="/super-admin/content"
                className="inline-flex items-center gap-2"
              >
                Content tools
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
        <Card className="border-white/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#1F3C88]/70">
                Tracks & Courses
              </p>
              <p className="text-sm text-slate-600">
                Add, edit, and review curriculum content.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link
                href="/super-admin/content"
                className="inline-flex items-center gap-2"
              >
                Manage content
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      <Card className="border-white/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(31,60,136,0.08)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1F3C88]">
              User Management
            </h2>
            <p className="text-sm text-slate-600">
              View sign-ups and drill into learner progress.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Name
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Email
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Sign-up Date
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Track
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Role
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-3 py-3 text-slate-900">
                    {user.name || "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">{user.email}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {user.profile?.careerTrack || "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {user.isSuperAdmin ? "Super Admin" : "User"}
                  </td>
                  <td className="px-3 py-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/super-admin/users/${user.id}`}>
                        View details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-slate-500"
                    colSpan={6}
                  >
                    No users found.
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
