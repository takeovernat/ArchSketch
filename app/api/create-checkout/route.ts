// app/api/create-checkout/route.ts
import { createServerClient } from '@/lib/supabase/server';;
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-11-17.clover' });

export async function POST() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: user.email,
    line_items: [{
      price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
    metadata: { user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}