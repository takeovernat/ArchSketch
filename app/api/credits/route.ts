// app/api/credits/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getOrCreateCredits(supabase: any, userId: string) {
  let { data: credits } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!credits) {
    const { data, error } = await supabase
      .from('user_credits')
      .insert({ user_id: userId })
      .select()
      .single();
    if (error) throw error;
    credits = data;
  }
  return credits!;
}

export async function GET() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const credits = await getOrCreateCredits(supabase, user.id);

  return NextResponse.json({
    creditsUsed: credits.credits_used ?? 0,
    hasPro: credits.has_pro ?? false,
    remaining: credits.has_pro ? Infinity : Math.max(0, 2 - (credits.credits_used ?? 0)),
  });
}

export async function POST() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const credits = await getOrCreateCredits(supabase, user.id);

  if (credits.has_pro) return NextResponse.json({ allowed: true });
  if ((credits.credits_used ?? 0) >= 2) return NextResponse.json({ allowed: false, upgrade: true });

  await supabase
    .from('user_credits')
    .update({ credits_used: (credits.credits_used ?? 0) + 1 })
    .eq('user_id', user.id);

  return NextResponse.json({ allowed: true });
}