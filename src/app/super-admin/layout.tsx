import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!(session.user as any).isSuperAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f3f6ff] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-12">{children}</div>
    </div>
  );
}
