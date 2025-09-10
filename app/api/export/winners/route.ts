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

  const rows = winners.map((s) => [
  s.id,
  s.createdAt.toISOString().slice(0, 10),
  s.buyer?.name ?? "",
  s.player?.name ?? "",
  s.qty ?? 0,
  s.due ?? 0,
  s.received ?? 0,
  s.balance ?? 0,
  s.note ?? "",
]);
  
  const csv = [row(header), ...rows.map(row)].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="winners.csv"',
    },
  });
}
