
import { NextResponse } from "next/server"; import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient();
export async function POST(req: Request){
  const { gameId, boardNumber, scores } = await req.json();
  const board = await prisma.board.findUnique({ where: { gameId_boardNumber: { gameId, boardNumber } } });
  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });
  const data = board.squares as any; const out:any[] = []; const quarters = ["Q1","Q2","Q3","FINAL"];
  for (const q of quarters) { const s = (scores||{})[q]; if (!s) continue; const key = `${(Number(s.away)||0)%10}-${(Number(s.home)||0)%10}`; const sq = data?.squares?.[key] ?? null; let playerId: string | null = null; if (sq && typeof sq !== "string" && sq.playerId) playerId = sq.playerId; const existing = await prisma.winner.findFirst({ where: { gameId, boardNumber, quarter: q } }); let w; if (existing) w = await prisma.winner.update({ where: { id: existing.id }, data: { boardId: board.id, square: key, playerId } }); else w = await prisma.winner.create({ data: { gameId, boardId: board.id, boardNumber, quarter: q, square: key, playerId, payout: 0 } }); out.push(w); }
  return NextResponse.json({ winners: out });
}
