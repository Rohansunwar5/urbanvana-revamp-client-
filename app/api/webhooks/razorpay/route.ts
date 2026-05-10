import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ensureRedisConnected } from '@/lib/redis';
import orderService from '@/lib/services/order.service';

export async function POST(request: Request) {
  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const rawBody = await request.text();

  try {
    await connectDB();
    ensureRedisConnected();
    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    await orderService.processWebhook(rawBody, signature, payload);
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
