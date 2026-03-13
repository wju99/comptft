export type TournamentValue = number | string | null;

export interface TournamentLeaderboardEntry {
  position: number | null;
  name: string;
  region: string;
  totalPoints: number | null;
  gameResults: TournamentValue[];
  status: string | null;
  tiebreaker: TournamentValue | null;
}

export interface TournamentLeaderboard {
  sheetName: string;
  note: string | null;
  gameLabels: string[];
  tiebreakerLabel: string | null;
  entries: TournamentLeaderboardEntry[];
}

export interface LobbyPlayerResult {
  name: string;
  points: number | null;
  costreamer: string | null;
}

export interface LobbyGroup {
  name: string;
  players: LobbyPlayerResult[];
}

export interface LobbyGame {
  id: string;
  label: string;
  dayLabel: string;
  lobbies: LobbyGroup[];
}

export interface LobbyDay {
  id: string;
  label: string;
  games: LobbyGame[];
}

export interface TournamentLobbies {
  sheetName: string;
  days: LobbyDay[];
}

export interface TournamentStage {
  id: string;
  name: string;
  leaderboard: TournamentLeaderboard | null;
  lobbies: TournamentLobbies | null;
}

export interface TournamentData {
  title: string;
  sourceUrl: string;
  exportUrl: string;
  fetchedAt: string;
  stages: TournamentStage[];
}
