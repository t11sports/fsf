
import { NextResponse } from "next/server"; import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient();
export async function GET(_req: Request, { params }: { params: { gameId: string; boardNumber: string } }){
  const gameId = params.gameId; const num = Number(params.boardNumber)||1;
  const board = await prisma.board.findUnique({ where: { gameId_boardNumber: { gameId, boardNumber: num } } });
  if (!board) { const created = await prisma.board.create({ data: { gameId, boardNumber: num, squares: { digits:{ away:[0,1,2,3,4,5,6,7,8,9], home:[0,1,2,3,4,5,6,7,8,9] }, squares:{} } } }); return NextResponse.json(created.squares ?? {}); }
  return NextResponse.json(board.squares ?? {});
}
export async function PUT(req: Request, { params }: { params: { gameId: string; boardNumber: string } }){
  const body = await req.json(); const gameId = params.gameId; const num = Number(params.boardNumber)||1;
  const updated = await prisma.board.upsert({ where: { gameId_boardNumber: { gameId, boardNumber: num } }, update: { squares: body }, create: { gameId, boardNumber: num, squares: body } });
  return NextResponse.json(updated.squares);
}
