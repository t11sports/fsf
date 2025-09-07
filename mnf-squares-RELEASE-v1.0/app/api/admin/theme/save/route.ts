
import { NextResponse } from "next/server";
import { requireRole } from "@/app/lib/requireRole";
import fs from "fs";
export async function POST(req: Request){
  const forbidden = await requireRole("ADMIN", req); if (forbidden) return forbidden;
  const body = await req.json();
  fs.mkdirSync(process.cwd()+"/data", { recursive: true });
  fs.writeFileSync(process.cwd()+"/data/theme.json", JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}
