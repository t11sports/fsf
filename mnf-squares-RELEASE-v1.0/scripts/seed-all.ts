
/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function seedScheduleCSV(csvRelPath: string){
  const csvPath = path.join(process.cwd(), csvRelPath);
  const raw = fs.readFileSync(csvPath, "utf8");
  const lines = raw.trim().split(/\r?\n/);
  lines.shift(); // header
  for (const line of lines) {
    const [weekStr, dateStr, awayTeam, homeTeam] = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s=>s.replace(/^"|"$|\r/g,''));
    const week = parseInt(weekStr, 10);
    const date = new Date(dateStr + "T20:15:00Z");
    const game = await prisma.game.create({ data: { week, date, homeTeam, awayTeam } });
    const blank = { digits:{ away:[0,1,2,3,4,5,6,7,8,9], home:[0,1,2,3,4,5,6,7,8,9] }, squares:{} };
    await prisma.board.create({ data: { gameId: game.id, boardNumber: 1, squares: blank } });
    await prisma.board.create({ data: { gameId: game.id, boardNumber: 2, squares: blank } });
  }
  console.log("Seeded schedule:", csvRelPath);
}

async function main(){
  await seedScheduleCSV("data/nfl-mnf-2025.csv");
  console.log("Done.");
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());
