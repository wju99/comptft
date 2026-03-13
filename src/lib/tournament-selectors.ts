import type { TournamentStage } from "@/types/tournament";

export function getStageById(stages: TournamentStage[], stageId?: string | null) {
  if (stageId) {
    const exact = stages.find((stage) => stage.id === stageId);

    if (exact) {
      return exact;
    }
  }

  return (
    stages.find((stage) => stage.leaderboard !== null && stage.leaderboard.entries.length > 0) ??
    stages.find((stage) => stage.lobbies !== null && stage.lobbies.days.length > 0) ??
    stages[0] ??
    null
  );
}
