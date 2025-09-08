
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/app/lib/requireRole";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request){
  const forbidden = await requireRole("ADMIN", req); if (forbidden) return forbidden;

  try {
    const csvPath = path.join(process.cwd(), "data", "nfl-mnf-2025.csv");
    const raw = fs.readFileSync(csvPath, "utf8");
    const lines = raw.trim().split(/\r?\n/);
    const header = lines.shift();
    const out: any[] = [];
    for (const line of lines) {
      const [weekStr, dateStr, awayTeam, homeTeam] = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s=>s.replace(/^"|"$|\r/g,''));
      const week = parseInt(weekStr, 10);
      const date = new Date(dateStr + "T20:15:00Z"); // 8:15 ET approx
      const game = await prisma.game.create({ data: { week, date, homeTeam, awayTeam } });
      // Two boards per game, blank template
      const blank = { digits:{ away:[0,1,2,3,4,5,6,7,8,9], home:[0,1,2,3,4,5,6,7,8,9] }, squares:{} };
      await prisma.board.create({ data: { gameId: game.id, boardNumber: 1, squares: blank } });
      await prisma.board.create({ data: { gameId: game.id, boardNumber: 2, squares: blank } });
      out.push({ id: game.id, week, date: dateStr, homeTeam, awayTeam });
    }
    return NextResponse.json({ ok: true, created: out.length, games: out });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || "Failed to seed schedule" }, { status: 500 });
  }
}
