
import { NextResponse } from "next/server"; import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient();
export async function POST(req: Request){
  const { gameId, boardNumber, quarter, away, home, payout } = await req.json();
  const board = await prisma.board.findUnique({ where: { gameId_boardNumber: { gameId, boardNumber } } });
  if (!board) return NextResponse.json({ error: "Board not found" }, { status: 404 });
  const data = board.squares as any; const key = `${(Number(away)||0)%10}-${(Number(home)||0)%10}`; const sq = data?.squares?.[key] ?? null;
  let playerId: string | null = null; if (sq && typeof sq !== "string" && sq.playerId) playerId = sq.playerId;
  const winner = await prisma.winner.create({ data: { gameId, boardId: board.id, boardNumber, quarter, square: key, playerId, payout: Number(payout||0) } });
  return NextResponse.json({ winner });
}
