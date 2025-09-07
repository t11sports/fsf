
import { NextResponse } from "next/server";
import { parseCookies, verifySessionToken } from "@/app/lib/auth";
export async function requireRole(required: "ADMIN"|"ORGANIZER"|"VIEWER"|"ANY", req?: Request) {
  const cookies = parseCookies(req?.headers.get("cookie"));
  const roleCookie = cookies["role"] as any;
  if (required !== "ANY" && roleCookie) {
    const role = String(roleCookie).toUpperCase();
    if (role === "ADMIN" || (role === "ORGANIZER" && required !== "ADMIN") || required === "VIEWER") return null;
  }
  const token = cookies["session"];
  const sess = verifySessionToken(token);
  const role = (sess?.role || "VIEWER") as string;
  const allowed = required === "ANY" || role === "ADMIN" || (required === "ORGANIZER" && role !== "VIEWER") || (required === "VIEWER");
  if (allowed) return null;
  return NextResponse.json({ error: "Unauthorized", required }, { status: 401 });
}
