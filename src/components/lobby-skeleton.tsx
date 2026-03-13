import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function LobbySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-20 animate-pulse rounded-lg bg-muted"
            aria-hidden
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-8 w-16 animate-pulse rounded-lg bg-muted/80"
            aria-hidden
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted/80" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 8 }).map((_, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border/60 px-3 py-2"
                >
                  <div className="space-y-1">
                    <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                    <div className="h-3 w-20 animate-pulse rounded bg-muted/40" />
                  </div>
                  <div className="h-5 w-12 animate-pulse rounded bg-muted/60" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
