import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Server-side guard to ensure the caller is a super admin.
 * Returns the authenticated session when authorized or a JSON response otherwise.
 */
export async function requireSuperAdmin() {
  const session = await auth();

  if (!session?.user || !(session.user as any).isSuperAdmin) {
    return {
      errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }

  return { session };
}
