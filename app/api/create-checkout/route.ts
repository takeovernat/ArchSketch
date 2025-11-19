// app/api/create-checkout/route.ts
import { createServerClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { priceId, credits } = body; // credits = 50, 150, or 500

  const session = await stripe.checkout.sessions.create({
    mode: "payment", // ← one-time
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }?bought=true`,
    cancel_url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }`,
    metadata: { user_id: user.id, credits_to_add: credits.toString() },
  });

  return NextResponse.json({ url: session.url });
}
