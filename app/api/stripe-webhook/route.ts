// app/api/stripe-webhook/route.ts
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata?.user_id;
    const credits = parseInt(session.metadata?.credits_to_add || "0", 10);

    if (userId && credits > 0) {
      console.log(`Adding ${credits} credits to user ${userId}`);
      await supabase.from("user_credits").upsert(
        {
          user_id: userId,
          total_credits: supabase.raw(`total_credits + ${credits}`),
        },
        { onConflict: "user_id" }
      );
    }
  }

  return new Response("OK", { status: 200 });
}
