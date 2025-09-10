import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // ⛔️ disable static generation

export async function GET(req: Request) {
  // Prisma code...
  try {
    const [playersCount, buyersCount, gamesCount, sales] = await Promise.all([
      prisma.player.count(),
      prisma.buyer.count(),
      prisma.game.count(),
      prisma.sale.findMany(),
    ]);

    // Explicitly define type for sales
    const totalDue = sales.reduce((sum: number, sale: typeof sales[number]) => sum + (sale.due ?? 0), 0);
    const totalReceived = sales.reduce((sum: number, sale: typeof sales[number]) => sum + (sale.received ?? 0), 0);
    const totalBalance = sales.reduce((sum: number, sale: typeof sales[number]) => sum + (sale.balance ?? 0), 0);

    const kpis = {
      Players: playersCount,
      Buyers: buyersCount,
      Games: gamesCount,
      'Total Due ($)': totalDue,
      'Total Received ($)': totalReceived,
      'Total Balance ($)': totalBalance,
    };

    return NextResponse.json({ kpis });
  } catch (error) {
    console.error('Summary API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
