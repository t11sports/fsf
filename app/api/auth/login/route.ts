
import { NextResponse } from "next/server";
import { signSession } from "@/app/lib/auth";
export async function POST(req: Request) {
  const { username, password } = await req.json();
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS || "admin123";
  const organizerUser = process.env.ORGANIZER_USER || "organizer";
  const organizerPass = process.env.ORGANIZER_PASS || "organizer123";
  let assigned: "ADMIN"|"ORGANIZER"|"VIEWER" = "VIEWER";
  if (username === adminUser && password === adminPass) assigned = "ADMIN";
  else if (username === organizerUser && password === organizerPass) assigned = "ORGANIZER";
  else return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const token = signSession({ role: assigned, name: username });
  const res = NextResponse.json({ ok: true, role: assigned });
  res.headers.append("Set-Cookie", `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
  res.headers.append("Set-Cookie", `role=${assigned}; Path=/; SameSite=Lax; Max-Age=604800`);
  return res;
}
