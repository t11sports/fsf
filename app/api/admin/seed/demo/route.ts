import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '@/app/lib/requireRole';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Require ADMIN role
  const accessCheck = await requireRole('ADMIN', req);
  if (accessCheck) return accessCheck;

  // Seed Players
  const [alex, blake] = await prisma.$transaction([
    prisma.player.upsert({
      where: { name: 'Alex Johnson' },
      update: {},
      create: {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        jerseyNumber: 12,
      },
    }),
    prisma.player.upsert({
      where: { name: 'Blake Rivera' },
      update: {},
      create: {
        name: 'Blake Rivera',
        email: 'blake@example.com',
        jerseyNumber: 22,
      },
    }),
  ]);

  // Seed Buyers
  const [chris, dana] = await prisma.$transaction([
    prisma.buyer.upsert({
      where: { name: 'Chris P.' },
      update: {
        email: 'chris@example.com',
        phone: '+15555550100',
      },
      create: {
        name: 'Chris P.',
        email: 'chris@example.com',
        phone: '+15555550100',
      },
    }),
    prisma.buyer.upsert({
      where: { name: 'Dana S.' },
      update: {
        email: 'dana@example.com',
        phone: '+15555550101',
      },
      create: {
        name: 'Dana S.',
        email: 'dana@example.com',
        phone: '+15555550101',
      },
    }),
  ]);

  // Create Demo Game
  const game = await prisma.game.create({
    data: {
      week: 1,
      date: new Date(),
      homeTeam: process.env.ORG_HOME_TEAM || 'Home',
      awayTeam: process.env.ORG_AWAY_TEAM || 'Away',
    },
  });

  // Blank board template
  const blankBoard = {
    digits: {
      away: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      home: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    squares: {},
  };

  // Create two boards
  const [board1, board2] = await prisma.$transaction([
    prisma.board.create({
      data: {
        gameId: game.id,
        boardNumber: 1,
        squares: blankBoard,
      },
    }),
    prisma.board.create({
      data: {
        gameId: game.id,
        boardNumber: 2,
        squares: blankBoard,
      },
    }),
  ]);

  // Create Sales
  await prisma.$transaction([
    prisma.sale.create({
      data: {
        buyerId: chris.id,
        qty: 3,
        due: 30,
        received: 30,
        balance: 0,
        note: 'demo',
      },
    }),
    prisma.sale.create({
      data: {
        buyerId: dana.id,
        qty: 2,
        due: 20,
        received: 20,
        balance: 0,
        note: 'demo',
      },
    }),
  ]);

  // Create Winners
  await prisma.$transaction([
    prisma.winner.create({
      data: {
        gameId: game.id,
        boardId: board1.id,
        boardNumber: 1,
        quarter: 'Q1',
        square: '7-3',
        payout: 50,
        playerId: alex.id,
      },
    }),
    prisma.winner.create({
      data: {
        gameId: game.id,
        boardId: board2.id,
        boardNumber: 2,
        quarter: 'FINAL',
        square: '0-0',
        payout: 200,
        playerId: blake.id,
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    message: 'Demo seed data inserted',
    gameId: game.id,
    boards: [board1.id, board2.id],
  });
}
