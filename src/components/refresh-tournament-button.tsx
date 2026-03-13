"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RefreshTournamentButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await fetch("/api/tournament/refresh", { method: "POST" });
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-2"
    >
      <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Refreshing…" : "Refresh data"}
    </Button>
  );
}
