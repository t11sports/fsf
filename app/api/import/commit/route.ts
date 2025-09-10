// app/api/import/commit/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  const rows: Record<string, unknown>[] = body.rows;
  const mapping: {
    players?: { name?: string };
    sales?: {
      buyerName?: string;
      qty?: string;
      due?: string;
      received?: string;
    };
  } = body.mapping;

  let buyers = 0,
    sales = 0,
    players = 0;

  await prisma.$transaction(async (px: Prisma.TransactionClient) => {
    for (const r of rows) {
      // Add Player
      if (mapping?.players?.name && r[mapping.players.name]) {
        const name = String(r[mapping.players.name]).trim();
        if (name) {
          await px.player.upsert({
            where: { name },
            update: {},
            create: { name },
          });
          players++;
        }
      }

      // Add Buyer & Sale
      if (mapping?.sales?.buyerName && r[mapping.sales.buyerName]) {
        const bn = String(r[mapping.sales.buyerName]).trim();

        const buyer = await px.buyer.upsert({
          where: { name: bn },
          update: {},
          create: { name: bn },
        });

        buyers++;

        const qty = Number(r[mapping.sales.qty ?? ""] ?? 0);
        const due =
          mapping.sales.due !== undefined
            ? Number(r[mapping.sales.due] ?? 0)
            : qty * 10;

        const received =
          mapping.sales.received !== undefined
            ? Number(r[mapping.sales.received] ?? 0)
            : 0;

        await px.sale.create({
          data: {
            buyerId: buyer.id,
            qty,
            due,
            received,
            balance: due - received,
          },
        });

        sales++;
      }
    }
  });

  return NextResponse.json({
    ok: true,
    createdPlayers: players,
    createdBuyers: buyers,
    createdSales: sales,
  });
}
