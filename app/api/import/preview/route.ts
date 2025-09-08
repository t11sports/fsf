
import { NextResponse } from "next/server"; import * as XLSX from "xlsx";
export const runtime = "nodejs";
export async function POST(req: Request){ const form = await req.formData(); const file = form.get("file") as File | null; if (!file) return NextResponse.json({ error: "file required" }, { status: 400 }); const buf = Buffer.from(await file.arrayBuffer()); const wb = XLSX.read(buf, { type: "buffer" }); const ws = wb.Sheets[wb.SheetNames[0]]; const rows:any[] = XLSX.utils.sheet_to_json(ws, { defval: "" }); const headers = Object.keys(rows[0]||{}); return NextResponse.json({ sheetNames: wb.SheetNames, headers, rows, sample: rows.slice(0,10), count: rows.length }); }
