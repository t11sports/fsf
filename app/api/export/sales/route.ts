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
  const sales = await prisma.sale.findMany({
    include: { buyer: true, player: true },
  });

  const header = [
    "SaleId",
    "Date",
    "Buyer",
    "Player",
    "Qty",
    "Due",
    "Received",
    "Balance",
    "Note",
  ];

  const rows = sales.map((s: {
    id: string; // ← this is string, not number
    createdAt: Date;
    qty: number | null;
    due: number;
    received: number;
    balance: number;
    note?: string | null;
    buyer?: { name?: string | null } | null;
    player?: { name?: string | null } | null;
  }) => [
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
      "Content-Disposition": 'attachment; filename="sales.csv"',
    },
  });
}
