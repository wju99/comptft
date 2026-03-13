import { Suspense } from "react";

import { AppNav } from "@/components/app-nav";
import { LeaderboardContent } from "@/components/leaderboard-content";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";
import { RefreshTournamentButton } from "@/components/refresh-tournament-button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function LeaderboardsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const stageParam = Array.isArray(params.stage) ? params.stage[0] : params.stage;

  return (
    <div className="min-h-screen bg-grid-pattern">
      <AppNav currentPath="/leaderboards" />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary">Stage leaderboards</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">Standings</h2>
            <p className="max-w-2xl text-muted-foreground">
              Browse each stage&apos;s leaderboard as the source Google Sheet updates.
            </p>
          </div>

          <RefreshTournamentButton />
        </section>

        <Suspense fallback={<LeaderboardSkeleton />}>
          <LeaderboardContent stageParam={stageParam} />
        </Suspense>
      </main>
    </div>
  );
}
