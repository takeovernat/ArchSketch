// components/AuthButton.tsx
'use client';

import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  if (!user) {
    return (
      <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
        Sign in with Google
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">Hi, {user.email}</span>
      <Button variant="outline" className="h-8 px-3 text-sm" onClick={() => supabase.auth.signOut()}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}