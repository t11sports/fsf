import { NextResponse } from 'next/server'; 
export const dynamic = 'force-dynamic'; // ⛔️ disable static generation
export async function GET(req: Request) {
  // Prisma code...
  return NextResponse.json({status:'ready'}); }
