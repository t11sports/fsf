import { NextResponse } from 'next/server'; 
import * as QRCode from 'qrcode';
export async function GET(req: Request){ 
  const { searchParams } = new URL(req.url); 
  const text=searchParams.get('text')||'https://example.com'; 
  const png = await QRCode.toBuffer(text,{ margin:1, width:256}); 
  return new NextResponse(png as any,{ headers:{'Content-Type':'image/png'}});}
