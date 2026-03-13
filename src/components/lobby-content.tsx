import Link from "next/link";

import { LobbyBrowser } from "@/components/lobby-browser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTournamentData } from "@/lib/google-sheet";
import { getStageById } from "@/lib/tournament-selectors";

type LobbyContentProps = {
  stageParam?: string;
  dayParam?: string;
  gameParam?: string;
};

export async function LobbyContent({
  stageParam,
  dayParam,
  gameParam,
}: LobbyContentProps) {
  const tournament = await getTournamentData();
  const stagesWithLobbies = tournament.stages.filter((stage) => stage.lobbies);
  const selectedStage = getStageById(stagesWithLobbies, stageParam);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {tournament.stages
          .filter((stage) => stage.lobbies)
          .map((stage) => (
            <Button
              key={stage.id}
              render={<Link href={`/lobbies?stage=${stage.id}`} />}
              variant={selectedStage?.id === stage.id ? "default" : "outline"}
            >
              {stage.name}
            </Button>
          ))}
      </div>

      {selectedStage?.lobbies ? (
        <LobbyBrowser
          lobbies={selectedStage.lobbies}
          stageId={selectedStage.id}
          selectedDayId={dayParam}
          selectedGameId={gameParam}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No lobbies selected</CardTitle>
            <CardDescription>
              This stage does not have lobby data in the published workbook yet.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
