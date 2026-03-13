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
                The Rolldown podcast (featuring WigWugg and Broseph) does a deep dive into the TFT competition at Set 16 AMER Regionals.
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={stage.leaderboard ? "default" : "outline"}>
                  {stage.leaderboard ? "Leaderboard" : "No leaderboard"}
                </Badge>
                <Badge variant={stage.lobbies ? "secondary" : "outline"}>
                  {stage.lobbies ? "Lobbies" : "No lobbies"}
                </Badge>
              </div>
              <CardTitle>{stage.name}</CardTitle>
              <CardDescription>
                {stage.leaderboard
                  ? `${stage.leaderboard.entries.length} players tracked`
                  : "Waiting for standings data"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
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
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
