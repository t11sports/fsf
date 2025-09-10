// app/api/export/winners/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function row(fields: (string | number | null | undefined)[]) {
  return fields
    .map((v) => {
      const s = v == null ? "" : String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? '"' + s.replace(/"/g, '""') + '"'
        : s;
    })
    .join(",");
}

export const dynamic = "force-dynamic"; // ⛔️ disables static generation

export async function GET(req: Request) {
  const winners = await prisma.winner.findMany({
    include: { player: true, game: true },
    orderBy: { createdAt: "asc" },
  });

  const header = [
    "GameId",
    "Week",
    "Date",
    "Board",
    "Quarter",
    "Square",
    "Player",
    "Payout",
  ];

  const rows = winners.map((
    w: {
      gameId: number;
      boardNumber: number | null;
      quarter: number;
      square: number;
      payout: number | null;
      player?: { name?: string | null } | null;
      game?: { week?: string | null; date?: Date | null } | null;
    }
  ) => [
    w.gameId,
    w.game?.week ?? "",
    w.game?.date?.toISOString?.().slice(0, 10) ?? "",
    w.boardNumber ?? "",
    w.quarter,
    w.square,
    w.player?.name ?? "",
    w.payout ?? 0,
  ]);

  const csv = [row(header), ...rows.map(row)].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="winners.csv"',
    },
  });
}
