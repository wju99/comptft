import { Suspense } from "react";

import { AppNav } from "@/components/app-nav";
import { OverviewContent } from "@/components/overview-content";
import { OverviewSkeleton } from "@/components/overview-skeleton";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-grid-pattern">
      <AppNav currentPath="/" />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
        <Suspense fallback={<OverviewSkeleton />}>
          <OverviewContent />
        </Suspense>
      </main>
    </div>
  );
}
