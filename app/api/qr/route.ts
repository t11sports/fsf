import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || 'https://example.com';

  const png = await QRCode.toDataURL(text, { margin: 1, width: 256 });

  return new NextResponse(Buffer.from(png.split(',')[1], 'base64'), {
    headers: { 'Content-Type': 'image/png' }
  });
}
