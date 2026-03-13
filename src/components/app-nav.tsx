import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Overview" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/lobbies", label: "Lobbies" },
];

export function AppNav({ currentPath }: { currentPath: string }) {
  return (
    <header className="border-b border-primary/20 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="font-display text-xl font-semibold tracking-tight">CompTFT</h1>

        <nav className="flex flex-wrap gap-2">
          {links.map((link) => {
            const isActive =
              currentPath === link.href ||
              (link.href !== "/" && currentPath.startsWith(link.href));

            return (
              <Button
                key={link.href}
                render={
                  <Link
                    href={link.href}
                    className={cn(
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                    )}
                  />
                }
                variant={isActive ? "default" : "outline"}
              >
                {link.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
