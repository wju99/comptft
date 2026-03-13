import { NextResponse } from "next/server";

import { getTournamentData } from "@/lib/google-sheet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getTournamentData();
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load tournament data.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
