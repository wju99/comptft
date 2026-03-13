import { LobbyBrowser } from "@/components/lobby-browser";
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
      {selectedStage?.lobbies ? (
        <LobbyBrowser
          lobbies={selectedStage.lobbies}
          stageId={selectedStage.id}
          selectedDayId={dayParam}
          selectedGameId={gameParam}
          stages={stagesWithLobbies.map((s) => ({ id: s.id, name: s.name }))}
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
