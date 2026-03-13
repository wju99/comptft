import { unstable_cache } from "next/cache";
import * as XLSX from "xlsx";

import { parseTournamentWorkbook } from "@/lib/tournament-parser";

const DEFAULT_GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHWYMRPsavRWIUMJxzfAb-eUH-VZMb6R8CMi2rtK_YMBHfmlMO0zG3oeBo3q6PRNL9GapsFbGeENNl/pubhtml#gid=1912431948";

const DEFAULT_TOURNAMENT_TITLE = "AMER Regional Finals [Lore & Legends]";

function buildPublishedExportUrl(sourceUrl: string) {
  const url = new URL(sourceUrl);

  if (url.pathname.includes("/pubhtml")) {
    return `${url.origin}${url.pathname.replace("/pubhtml", "/pub")}?output=xlsx`;
  }

  if (url.pathname.includes("/pub")) {
    const exportUrl = new URL(url.toString());
    exportUrl.searchParams.set("output", "xlsx");
    return exportUrl.toString();
  }

  const match = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/);

  if (!match) {
    throw new Error("Unsupported Google Sheet URL format.");
  }

  return `${url.origin}/spreadsheets/d/${match[1]}/export?format=xlsx`;
}

const TOURNAMENT_CACHE_TAG = "tournament";

async function fetchTournamentDataUncached() {
  const sourceUrl = process.env.GOOGLE_SHEET_URL || DEFAULT_GOOGLE_SHEET_URL;
  const tournamentTitle = process.env.TOURNAMENT_TITLE || DEFAULT_TOURNAMENT_TITLE;
  const exportUrl = buildPublishedExportUrl(sourceUrl);

  const response = await fetch(exportUrl, {
    cache: "no-store",
    headers: {
      "User-Agent": "comptft/0.1",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tournament sheet (${response.status}).`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });

  return parseTournamentWorkbook({
    workbook,
    sourceUrl,
    exportUrl,
    title: tournamentTitle,
  });
}

export async function getTournamentData() {
  return unstable_cache(
    fetchTournamentDataUncached,
    [TOURNAMENT_CACHE_TAG],
    { tags: [TOURNAMENT_CACHE_TAG], revalidate: false }
  )();
}

export { TOURNAMENT_CACHE_TAG };

export { DEFAULT_GOOGLE_SHEET_URL, DEFAULT_TOURNAMENT_TITLE };
