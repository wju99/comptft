import * as XLSX from "xlsx";

import type {
  LobbyDay,
  LobbyGame,
  TournamentData,
  TournamentLeaderboard,
  TournamentLeaderboardEntry,
  TournamentLobbies,
  TournamentStage,
  TournamentValue,
} from "@/types/tournament";

type SheetRows = (string | number)[][];

const LOBBY_LABEL_REGEX = /^lobby\s+\d+/i;
const DAY_LABEL_REGEX = /^day\s*(\d+)$/i;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asString(value: string | number | undefined) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function asNumber(value: string | number | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const text = asString(value);

  if (!text || text === "-" || text === "--") {
    return null;
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function asTournamentValue(value: string | number | undefined): TournamentValue {
  const numeric = asNumber(value);

  if (numeric !== null) {
    return numeric;
  }

  const text = asString(value);
  return text ? text : null;
}

function normalizeDayLabel(value: string) {
  const match = value.match(DAY_LABEL_REGEX);

  if (!match) {
    return null;
  }

  return `Day ${match[1]}`;
}

function normalizeRows(sheet: XLSX.WorkSheet): SheetRows {
  return XLSX.utils
    .sheet_to_json<(string | number)[]>(sheet, {
      header: 1,
      defval: "",
      raw: false,
      blankrows: false,
    })
    .map((row) => row.map((cell) => (typeof cell === "string" ? cell.trim() : cell)));
}

function getRowValue(row: (string | number)[], index: number) {
  return row[index] ?? "";
}

function inferStageName(sheetName: string) {
  if (sheetName.endsWith(" - Leaderboard")) {
    return sheetName.replace(/ - Leaderboard$/, "").trim();
  }

  if (sheetName.endsWith(" - Lobbies")) {
    return sheetName.replace(/ - Lobbies$/, "").trim();
  }

  return sheetName.trim();
}

function parseLeaderboardSheet(sheetName: string, rows: SheetRows): TournamentLeaderboard | null {
  const headerIndex = rows.findIndex((row) => {
    const normalized = row.map((cell) => asString(cell).toLowerCase());
    return normalized.includes("position") && normalized.includes("name") && normalized.includes("points");
  });

  if (headerIndex === -1) {
    return null;
  }

  const headerRow = rows[headerIndex];
  const note = rows
    .slice(0, headerIndex)
    .flatMap((row) => row.map(asString))
    .find((value) => value.length > 0) ?? null;

  const positionIndex = headerRow.findIndex((cell) => asString(cell).toLowerCase() === "position");
  const nameIndex = headerRow.findIndex((cell) => asString(cell).toLowerCase() === "name");
  const regionIndex = headerRow.findIndex((cell) => asString(cell).toLowerCase() === "region");
  const pointsIndex = headerRow.findIndex((cell) => asString(cell).toLowerCase() === "points");
  const gameIndexes = headerRow.reduce<number[]>((indexes, cell, index) => {
    if (/^game\s+\d+/i.test(asString(cell))) {
      indexes.push(index);
    }

    return indexes;
  }, []);

  const trailingIndexes = headerRow.reduce<number[]>((indexes, cell, index) => {
    if (index > (gameIndexes.at(-1) ?? pointsIndex) && asString(cell).length > 0) {
      indexes.push(index);
    }

    return indexes;
  }, []);
  const statusIndex = trailingIndexes[0] ?? -1;
  const tiebreakerIndex = trailingIndexes[1] ?? -1;

  const entries: TournamentLeaderboardEntry[] = [];

  for (const row of rows.slice(headerIndex + 1)) {
    const name = asString(getRowValue(row, nameIndex));

    if (!name || name === "--") {
      continue;
    }

    const gameResults = gameIndexes.map((index) => asTournamentValue(getRowValue(row, index)));
    const inlineStatus = gameResults.find(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
    const status =
      inlineStatus ??
      (statusIndex >= 0 ? asString(getRowValue(row, statusIndex)) || null : null);

    entries.push({
      position: asNumber(getRowValue(row, positionIndex)),
      name,
      region: asString(getRowValue(row, regionIndex)),
      totalPoints: asNumber(getRowValue(row, pointsIndex)),
      gameResults,
      status,
      tiebreaker:
        tiebreakerIndex >= 0 ? asTournamentValue(getRowValue(row, tiebreakerIndex)) : null,
    });
  }

  return {
    sheetName,
    note,
    gameLabels: gameIndexes.map((index) => asString(getRowValue(headerRow, index))),
    tiebreakerLabel:
      tiebreakerIndex >= 0 ? asString(getRowValue(headerRow, tiebreakerIndex)) || null : null,
    entries,
  };
}

function parseLobbySheet(sheetName: string, rows: SheetRows): TournamentLobbies | null {
  const nameHeaderIndex = rows.findIndex((row) => row.some((cell) => asString(cell) === "Name"));

  if (nameHeaderIndex < 2) {
    return null;
  }

  const dayRow = rows[nameHeaderIndex - 2];
  const gameRow = rows[nameHeaderIndex - 1];
  const headerRow = rows[nameHeaderIndex];
  const bodyRows = rows.slice(nameHeaderIndex + 1);

  const gameColumns = headerRow.reduce<number[]>((indexes, cell, index) => {
    if (asString(cell).toLowerCase() === "name" && asString(getRowValue(headerRow, index + 1)).toLowerCase() === "points") {
      indexes.push(index);
    }

    return indexes;
  }, []);

  if (gameColumns.length === 0) {
    return null;
  }

  let currentDayLabel: string | null = null;

  const games: LobbyGame[] = gameColumns.map((startColumn, index) => {
    let currentLobbyName: string | null = null;
    const lobbies = new Map<string, { name: string; players: LobbyGame["lobbies"][number]["players"] }>();

    for (const row of bodyRows) {
      const lobbyCell = asString(getRowValue(row, startColumn - 1)) || asString(getRowValue(row, startColumn));

      if (LOBBY_LABEL_REGEX.test(lobbyCell)) {
        currentLobbyName = asString(getRowValue(row, startColumn)) || lobbyCell;

        if (!lobbies.has(currentLobbyName)) {
          lobbies.set(currentLobbyName, { name: currentLobbyName, players: [] });
        }

        continue;
      }

      const playerName = asString(getRowValue(row, startColumn));
      const costreamer = asString(getRowValue(row, startColumn + 2)) || null;

      if (!playerName || playerName === "--" || !currentLobbyName) {
        continue;
      }

      const lobby = lobbies.get(currentLobbyName);

      if (!lobby) {
        continue;
      }

      lobby.players.push({
        name: playerName,
        points: asNumber(getRowValue(row, startColumn + 1)),
        costreamer,
      });
    }

    const label = asString(getRowValue(gameRow, startColumn - 1)) || asString(getRowValue(gameRow, startColumn));
    const rawDayLabel =
      normalizeDayLabel(asString(getRowValue(dayRow, startColumn - 1))) ??
      normalizeDayLabel(asString(getRowValue(dayRow, startColumn)));
    const dayLabel = rawDayLabel ?? currentDayLabel ?? "Day 1";
    currentDayLabel = dayLabel;

    return {
      id: `${slugify(dayLabel || "day")}-${slugify(label || `game-${startColumn}`)}`,
      label: label || `Game ${index + 1}`,
      dayLabel: dayLabel || "Day 1",
      lobbies: Array.from(lobbies.values()).filter((lobby) => lobby.players.length > 0),
    };
  });

  const daysByLabel = new Map<string, LobbyDay>();

  for (const game of games) {
    const key = slugify(game.dayLabel);

    if (!daysByLabel.has(key)) {
      daysByLabel.set(key, {
        id: key,
        label: game.dayLabel,
        games: [],
      });
    }

    daysByLabel.get(key)?.games.push(game);
  }

  const days = Array.from(daysByLabel.values());
  return {
    sheetName,
    days,
  };
}

function shouldParseStageSheet(sheetName: string) {
  if (/^hide\b/i.test(sheetName) || /^sheet\d+$/i.test(sheetName)) {
    return false;
  }

  return (
    /leaderboard/i.test(sheetName) ||
    /lobbies/i.test(sheetName) ||
    sheetName === "Grand Finals" ||
    sheetName === "Grand Finals - Checkmate"
  );
}

export function parseTournamentWorkbook(params: {
  workbook: XLSX.WorkBook;
  sourceUrl: string;
  exportUrl: string;
  title: string;
}): TournamentData {
  const { workbook, sourceUrl, exportUrl, title } = params;
  const stageMap = new Map<string, TournamentStage>();

  for (const sheetName of workbook.SheetNames) {
    if (!shouldParseStageSheet(sheetName)) {
      continue;
    }

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      continue;
    }

    const rows = normalizeRows(sheet);
    const stageName = inferStageName(sheetName);
    const stageId = slugify(stageName);

    if (!stageMap.has(stageId)) {
      stageMap.set(stageId, {
        id: stageId,
        name: stageName,
        leaderboard: null,
        lobbies: null,
      });
    }

    const stage = stageMap.get(stageId);

    if (!stage) {
      continue;
    }

    if (/lobbies/i.test(sheetName)) {
      stage.lobbies = parseLobbySheet(sheetName, rows);
      continue;
    }

    stage.leaderboard = parseLeaderboardSheet(sheetName, rows);
  }

  return {
    title,
    sourceUrl,
    exportUrl,
    fetchedAt: new Date().toISOString(),
    stages: Array.from(stageMap.values()).filter(
      (stage) => stage.leaderboard !== null || stage.lobbies !== null,
    ),
  };
}
