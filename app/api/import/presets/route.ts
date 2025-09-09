
import { NextResponse } from "next/server";
import fs from "fs"; import path from "path";
export const dynamic = 'force-dynamic'; // ⛔️ disable static generation
export async function GET(req: Request) {
  // Prisma code...
  const dir = path.join(process.cwd(), "data", "import-presets");
  try {
    const files = fs.readdirSync(dir).filter(f=>f.endsWith(".json"));
    const presets = files.map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),"utf8")));
    return NextResponse.json(presets);
  } catch { return NextResponse.json([]); }
}
