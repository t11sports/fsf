
import { NextResponse } from "next/server";
const SEC_HEADERS: Record<string,string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer-when-downgrade",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
  "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
};
export function middleware(req: Request) {
  const url = new URL(req.url); const path = url.pathname;
  const role = (req.headers.get("cookie") || "").split(";").map(v=>v.trim()).find(v=>v.startsWith("role="))?.split("=")[1] || "";
  if (path.startsWith("/dashboard") || path.startsWith("/import") || path.startsWith("/live")) {
    if (!role || (role !== "ADMIN" && role !== "ORGANIZER")) return NextResponse.redirect(new URL("/login", url));
  }
  if (path.startsWith("/api/admin")) {
    if (role !== "ADMIN") return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const res = NextResponse.next(); for (const [k,v] of Object.entries(SEC_HEADERS)) res.headers.set(k,v); return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
