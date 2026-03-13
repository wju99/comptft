import Link from "next/link";

import { LeaderboardTable } from "@/components/leaderboard-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTournamentData } from "@/lib/google-sheet";
import { getStageById } from "@/lib/tournament-selectors";

type LeaderboardContentProps = {
  stageParam?: string;
};

export async function LeaderboardContent({ stageParam }: LeaderboardContentProps) {
  const tournament = await getTournamentData();
  const selectedStage = getStageById(tournament.stages, stageParam);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {tournament.stages
          .filter((stage) => stage.leaderboard)
          .map((stage) => (
            <Button
              key={stage.id}
              render={<Link href={`/leaderboards?stage=${stage.id}`} />}
              variant={selectedStage?.id === stage.id ? "default" : "outline"}
            >
              {stage.name}
            </Button>
          ))}
      </div>

      {selectedStage?.leaderboard ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>{selectedStage.name}</CardTitle>
            <CardDescription>
              {selectedStage.leaderboard.note || "Current standings pulled from the live sheet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeaderboardTable leaderboard={selectedStage.leaderboard} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No leaderboard selected</CardTitle>
            <CardDescription>
              This stage does not expose a leaderboard tab yet.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
