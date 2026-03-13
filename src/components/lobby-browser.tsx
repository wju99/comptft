"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TournamentLobbies } from "@/types/tournament";

type StageOption = { id: string; name: string };

function buildLobbyHref(stageId: string, dayId: string, gameId: string) {
  const params = new URLSearchParams({ stage: stageId, day: dayId, game: gameId });
  return `/lobbies?${params.toString()}`;
}

const selectClass =
  "w-full min-w-[8rem] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

export function LobbyBrowser({
  lobbies,
  stageId,
  selectedDayId,
  selectedGameId,
  stages = [],
}: {
  lobbies: TournamentLobbies;
  stageId: string;
  selectedDayId?: string;
  selectedGameId?: string;
  stages?: StageOption[];
}) {
  const router = useRouter();
  const selectedDay =
    lobbies.days.find((day) => day.id === selectedDayId) ?? lobbies.days[0] ?? null;
  const selectedGame =
    selectedDay?.games.find((game) => game.id === selectedGameId) ??
    selectedDay?.games[0] ??
    null;

  if (!selectedDay || !selectedGame) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lobbies unavailable</CardTitle>
          <CardDescription>This stage does not have lobby data yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const dayOptions = lobbies.days.map((day) => ({
    id: day.id,
    label: day.label,
    games: day.games.map((g) => ({ id: g.id, label: g.label })),
  }));

  const games = selectedDay.games;
  const selectedGameIdResolved =
    selectedGameId && games.some((g) => g.id === selectedGameId)
      ? selectedGameId
      : games[0]?.id ?? "";

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) router.push(`/lobbies?stage=${encodeURIComponent(value)}`);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const day = dayOptions.find((d) => d.id === value);
    const gameId = day?.games[0]?.id ?? "";
    if (value && gameId) router.push(buildLobbyHref(stageId, value, gameId));
  };

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) router.push(buildLobbyHref(stageId, selectedDay.id, value));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
        {stages.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Stage
            </label>
            <select
              className={selectClass}
              value={stageId}
              onChange={handleStageChange}
              aria-label="Select stage"
            >
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Day
          </label>
          <select
            className={selectClass}
            value={selectedDay.id}
            onChange={handleDayChange}
            aria-label="Select day"
          >
            {dayOptions.map((day) => (
              <option key={day.id} value={day.id}>
                {day.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Game
          </label>
          <select
            className={selectClass}
            value={selectedGameIdResolved}
            onChange={handleGameChange}
            aria-label="Select game"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {selectedGame.lobbies.map((lobby) => (
          <Card key={lobby.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{lobby.name}</CardTitle>
                <Badge variant="secondary">{lobby.players.length} players</Badge>
              </div>
              <CardDescription>
                {selectedDay.label} · {selectedGame.label}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lobby.players.map((player) => (
                <div
                  key={`${lobby.name}-${player.name}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-3 py-2"
                >
                  <p className="font-medium">{player.name}</p>
                  <Badge variant="outline">
                    {player.points === null ? "-" : `${player.points} pts`}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
