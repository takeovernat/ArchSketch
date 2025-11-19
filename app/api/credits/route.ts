// app/api/credits/route.ts
import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getOrCreateCredits(supabase: any, userId: string) {
  let { data: row } = await supabase
    .from("user_credits")
    .select("*")
    .eq("user_id", userId)
    .single();

  // THIS IS THE FIX → create row if it doesn't exist
  if (!row) {
    const { data, error } = await supabase
      .from("user_credits")
      .insert({
        user_id: userId,
        credits_used: 0,
        total_credits: 2, // ← new users get 2 free credits
      })
      .select()
      .single();

    if (error) throw error;
    row = data;
  }

  return row!;
}

export async function GET() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const credits = await getOrCreateCredits(supabase, user.id);

  const available = credits.total_credits - credits.credits_used; // ← New logic
  return NextResponse.json({
    creditsUsed: credits.credits_used ?? 0,
    totalCredits: credits.total_credits ?? 0, // ← New field
    remaining: available, // ← Simplified
  });
}

export async function POST() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const credits = await getOrCreateCredits(supabase, user.id);
  const available = credits.total_credits - credits.credits_used;

  if (available <= 0) {
    // ← Updated condition (no more has_pro)
    return NextResponse.json({ allowed: false, upgrade: true });
  }

  await supabase
    .from("user_credits")
    .update({ credits_used: credits.credits_used + 1 }) // ← Consume 1 credit
    .eq("user_id", user.id);

  return NextResponse.json({ allowed: true });
}
