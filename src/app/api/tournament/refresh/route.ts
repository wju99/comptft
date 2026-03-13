import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { TOURNAMENT_CACHE_TAG } from "@/lib/google-sheet";

export const dynamic = "force-dynamic";

export async function POST() {
  revalidateTag(TOURNAMENT_CACHE_TAG, "max");
  return NextResponse.json({ revalidated: true });
}
