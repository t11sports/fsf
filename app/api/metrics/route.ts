import { NextResponse } from 'next/server'; 
import { metrics } from '@/app/lib/metrics'; 
export const dynamic = 'force-dynamic'; // ⛔️ disable static generation
export async function GET(req: Request) {
  // Prisma code...
  return new NextResponse(metrics.dump(), { headers: {'Content-Type':'text/plain'} }); }
