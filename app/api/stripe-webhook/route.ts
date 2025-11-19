// app/api/stripe-webhook/route.ts
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-11-17.clover' });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata.user_id;
    if (userId) {
      await supabase
        .from('user_credits')
        .update({ has_pro: true })
        .eq('user_id', userId);
    }
  }

  return new Response('OK', { status: 200 });
}

export const config = { api: { bodyParser: false } };