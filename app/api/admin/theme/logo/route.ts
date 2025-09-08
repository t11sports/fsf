
import { NextResponse } from "next/server";
import { requireRole } from "@/app/lib/requireRole";
import fs from "fs"; import path from "path";
export const runtime="nodejs";
export async function POST(req: Request){
  const forbidden = await requireRole("ADMIN", req); if (forbidden) return forbidden;
  const form = await req.formData();
  const f = form.get("file") as File | null;
  if(!f) return NextResponse.json({ error: "file required" }, { status: 400 });
  const buf = Buffer.from(await f.arrayBuffer());
  const ext = (f.name.split(".").pop() || "png").toLowerCase();
  const dir = path.join(process.cwd(), "public", "brand");
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, "logo-upload."+ext);
  fs.writeFileSync(target, buf);
  return NextResponse.json({ ok: true, url: "/brand/"+path.basename(target) });
}
