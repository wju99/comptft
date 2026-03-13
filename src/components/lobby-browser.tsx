import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LobbySelector } from "@/components/lobby-selector";
import type { TournamentLobbies } from "@/types/tournament";

type StageOption = { id: string; name: string };

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
  /** Optional list of stages for unified Stage / Day / Game selector */
  stages?: StageOption[];
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

  const dayOptions = lobbies.days.map((day) => ({
    id: day.id,
    label: day.label,
    games: day.games.map((g) => ({ id: g.id, label: g.label })),
  }));

  return (
    <div className="space-y-6">
      <LobbySelector
        stages={stages}
        days={dayOptions}
        stageId={stageId}
        selectedDayId={selectedDay.id}
        selectedGameId={selectedGame.id}
      />

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
