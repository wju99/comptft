import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TournamentLeaderboard } from "@/types/tournament";

function formatValue(value: number | string | null) {
  if (value === null) {
    return "-";
  }

  return typeof value === "number" ? value.toString() : value;
}

export function LeaderboardTable({
  leaderboard,
}: {
  leaderboard: TournamentLeaderboard;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pos</TableHead>
          <TableHead>Player</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Total</TableHead>
          {leaderboard.gameLabels.map((label) => (
            <TableHead key={label}>{label}</TableHead>
          ))}
          <TableHead>Status</TableHead>
          {leaderboard.tiebreakerLabel ? (
            <TableHead>{leaderboard.tiebreakerLabel}</TableHead>
          ) : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.entries.map((entry) => (
          <TableRow key={entry.name}>
            <TableCell className="font-medium">{entry.position ?? "-"}</TableCell>
            <TableCell className="font-medium">{entry.name}</TableCell>
            <TableCell>{entry.region || "-"}</TableCell>
            <TableCell>{formatValue(entry.totalPoints)}</TableCell>
            {entry.gameResults.map((result, index) => (
              <TableCell key={`${entry.name}-${leaderboard.gameLabels[index]}`}>
                {typeof result === "string" ? (
                  <Badge variant="outline">{result}</Badge>
                ) : (
                  formatValue(result)
                )}
              </TableCell>
            ))}
            <TableCell>
              {entry.status ? <Badge>{entry.status}</Badge> : "-"}
            </TableCell>
            {leaderboard.tiebreakerLabel ? (
              <TableCell>{formatValue(entry.tiebreaker)}</TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
