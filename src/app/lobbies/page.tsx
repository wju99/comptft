import { Suspense } from "react";

import { AppNav } from "@/components/app-nav";
import { LobbyContent } from "@/components/lobby-content";
import { LobbySkeleton } from "@/components/lobby-skeleton";
import { RefreshTournamentButton } from "@/components/refresh-tournament-button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function LobbiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const stageParam = Array.isArray(params.stage) ? params.stage[0] : params.stage;
  const dayParam = Array.isArray(params.day) ? params.day[0] : params.day;
  const gameParam = Array.isArray(params.game) ? params.game[0] : params.game;

  return (
    <div className="min-h-screen bg-grid-pattern">
      <AppNav currentPath="/lobbies" />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary">Lobby browser</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">Games and lobbies</h2>
            <p className="max-w-2xl text-muted-foreground">
              Click through stages, then drill into a specific day and game to view
              every lobby in that round.
            </p>
          </div>

          <RefreshTournamentButton />
        </section>

        <Suspense fallback={<LobbySkeleton />}>
          <LobbyContent
            stageParam={stageParam}
            dayParam={dayParam}
            gameParam={gameParam}
          />
        </Suspense>
      </main>
    </div>
  );
}
