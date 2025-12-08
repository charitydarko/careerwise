import { prisma } from "@/lib/prisma";

import { ContentManager } from "./ui/content-manager";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const tracks = await prisma.track.findMany({
    include: { courses: true },
    orderBy: { createdAt: "desc" },
  });

  return <ContentManager initialTracks={tracks} />;
}
