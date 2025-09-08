
import { NextResponse } from "next/server";
import { rateLimit, applyRateHeaders } from "@/app/lib/rateLimit";
export function withLogging<T extends (...a:any[])=>Promise<any>>(handler:T, label?:string): T {
  return (async (...args:any[]) => {
    const req: Request | undefined = args?.[0];
    const rl = await rateLimit({ key: (req?.headers.get('x-forwarded-for')||'ip')+':'+(label||'') });
    if(!rl.allowed){ const res = NextResponse.json({ error: "Rate limited" }, { status: 429 }); return applyRateHeaders(res, rl); }
    try { const res = await handler(...args); return res; } catch { return NextResponse.json({ error: "Internal error" }, { status: 500 }); }
  }) as T;
}
