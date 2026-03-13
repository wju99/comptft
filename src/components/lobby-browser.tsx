import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TournamentLobbies } from "@/types/tournament";

function buildLobbyHref(stageId: string, dayId: string, gameId: string) {
  const params = new URLSearchParams({
    stage: stageId,
    day: dayId,
    game: gameId,
  });

  return `/lobbies?${params.toString()}`;
}

export function LobbyBrowser({
  lobbies,
  stageId,
  selectedDayId,
  selectedGameId,
}: {
  lobbies: TournamentLobbies;
  stageId: string;
  selectedDayId?: string;
  selectedGameId?: string;
}) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {lobbies.days.map((day) => (
          <Button
            key={day.id}
            render={<Link href={buildLobbyHref(stageId, day.id, day.games[0]?.id ?? "")} />}
            variant={day.id === selectedDay.id ? "default" : "outline"}
          >
            {day.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedDay.games.map((game) => (
          <Button
            key={game.id}
            render={<Link href={buildLobbyHref(stageId, selectedDay.id, game.id)} />}
            variant={game.id === selectedGame.id ? "default" : "outline"}
          >
            {game.label}
          </Button>
        ))}
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
                  <div className="space-y-1">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {player.costreamer || "No costreamer listed"}
                    </p>
                  </div>
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
