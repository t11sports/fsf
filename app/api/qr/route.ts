import { NextResponse } from 'next/server';
import { toDataURL } from 'qrcode';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || 'https://example.com';

  const dataUrl = await toDataURL(text, { margin: 1, width: 256 });

  const base64Data = dataUrl.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  return new NextResponse(buffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}
