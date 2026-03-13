import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <section className="flex w-full flex-col gap-6">
        <Card className="w-full border-border/60">
          <CardHeader className="space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="space-y-3">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted/80" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-32 animate-pulse rounded-md bg-muted" />
            ))}
          </CardContent>
        </Card>

        <div className="aspect-video w-full animate-pulse rounded-lg border border-border/60 bg-muted/30" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/60">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-6 w-28 animate-pulse rounded bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded bg-muted/80" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
