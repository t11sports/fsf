
import jwt from "jsonwebtoken";
export type Session = { role: "ADMIN"|"ORGANIZER"|"VIEWER"; name?: string; };
export function signSession(session: Session) { const secret = process.env.APP_JWT_SECRET || "dev-secret"; return jwt.sign(session, secret, { algorithm: "HS256", expiresIn: "7d" }); }
export function verifySessionToken(token?: string): Session | null { try { if (!token) return null; const secret = process.env.APP_JWT_SECRET || "dev-secret"; return jwt.verify(token, secret) as Session; } catch { return null; } }
export function parseCookies(header?: string | null): Record<string,string> { const out: Record<string,string> = {}; if (!header) return out; for (const part of header.split(';')) { const [k, ...rest] = part.trim().split('='); out[k] = decodeURIComponent(rest.join('=') || ''); } return out; }
