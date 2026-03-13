import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTournamentData } from "@/lib/google-sheet";

export async function OverviewContent() {
  const tournament = await getTournamentData();

  return (
    <>
      <section className="flex w-full flex-col gap-6">
        <Card className="w-full border-border/60">
          <CardHeader className="space-y-4">
            <div className="space-y-3">
              <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {tournament.title}
              </CardTitle>
              <CardDescription className="w-full text-base leading-7">
                The Rolldown podcast (featuring WigWugg and Broseph) does a deep dive into the competition at Set 16 AMER Regionals.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div className="w-full overflow-hidden rounded-lg border border-border/60 bg-muted/20">
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/voPHKEwAkD0"
            title="We Ranked EVERY PLAYER in the AMER Regional Finals | The Rolldown w/ WigWugg & Broseph | S16 E11"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tournament.stages.map((stage) => (
          <Card key={stage.id} className="border-border/60">
            <CardHeader>
              <CardTitle>{stage.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {stage.leaderboard ? (
                  <Button
                    render={<Link href={`/leaderboards?stage=${stage.id}`} />}
                    size="sm"
                  >
                    View standings
                  </Button>
                ) : null}
                {stage.lobbies ? (
                  <Button
                    render={<Link href={`/lobbies?stage=${stage.id}`} />}
                    size="sm"
                    variant="outline"
                  >
                    View lobbies
                  </Button>
                ) : null}
              </div>
              {stage.leaderboard ? (
                <div className="rounded-md border border-border/60">
                  {stage.leaderboard.entries.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                      TBD
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/60 hover:bg-transparent">
                          <TableHead className="h-7 px-2 text-xs font-medium">Pos</TableHead>
                          <TableHead className="h-7 px-2 text-xs font-medium">Player</TableHead>
                          <TableHead className="h-7 px-2 text-xs font-medium">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stage.leaderboard.entries.slice(0, 5).map((entry) => (
                          <TableRow key={entry.name} className="border-border/60">
                            <TableCell className="px-2 py-1 text-xs">
                              {entry.position ?? "-"}
                            </TableCell>
                            <TableCell className="px-2 py-1 text-xs font-medium">
                              {entry.name}
                            </TableCell>
                            <TableCell className="px-2 py-1 text-xs">
                              {entry.totalPoints ?? "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
