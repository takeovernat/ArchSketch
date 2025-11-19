'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputBox from '@/components/InputBox';
import DiagramViewer from '@/components/DiagramViewer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AuthButton from '@/components/AuthButton';
import ProModal from '@/components/ProModal';

export default function Home() {
  const [description, setDescription] = useState('');
  const [mermaid, setMermaid] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<{ remaining: number; hasPro: boolean } | null>(null);
  const [showProModal, setShowProModal] = useState(false);

useEffect(() => {
  if (user) fetchCredits();
}, [user]);

  useEffect(() => {
  // Inside useEffect or functions
const supabase = createClient();
  supabase.auth.getUser().then(({ data }) => {
    setUser(data.user);
    if (data.user) fetchCredits();
  });

  const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
    setUser(session?.user ?? null);
    if (session?.user) fetchCredits();
  });

  return () => { listener.subscription.unsubscribe(); };
}, []);

const fetchCredits = async () => {
  const res = await fetch('/api/credits');
  const data = await res.json();
  setCredits(data);
};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shared = params.get('diagram');
    if (shared) {
      try {
        setMermaid(atob(decodeURIComponent(shared)));
      } catch {}
    }
  }, []);

  // Add this useEffect – THIS FIXES THE POST-PAYMENT GREYED-OUT BUG
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('upgraded') === 'true') {
    // User just completed Stripe payment → force refresh credits
    fetchCredits();

    // Clean URL (optional but nice)
    window.history.replaceState({}, '', '/');
  }
}, []);


  // app/page.tsx — replace the whole generate function with this
const generate = async (refine = false) => {
  if (!user) {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({ provider: 'google' });
    return;
  }

  setLoading(true);
  setError('');

  try {
    // 1. Ask the backend: "Am I allowed to generate right now?"
    const permissionRes = await fetch('/api/credits', { method: 'POST' });
    const { allowed, upgrade } = await permissionRes.json();

    if (upgrade) {
      setShowProModal(true);
      setLoading(false);
      return;
    }

    if (!allowed) {
      setLoading(false);
      return;
    }

    // 2. Actually generate the diagram (your existing code)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        previousMermaid: refine ? mermaid : undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate');

    setMermaid(data.mermaid);
    setSuggestions(data.suggestions || []);

    // 🔥 THIS IS THE MISSING LINE 🔥
    // Refresh credits from DB so the UI updates (e.g. 2 → 1 → 0)
    fetchCredits();

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
       {showProModal && <ProModal onUpgrade={() => setShowProModal(false)} />}

      <Header >{<AuthButton />} </Header>

{/* Replace old header with */}
{/* <div className="flex justify-between items-center">
  <h1 className="text-5xl font-bold">ArchSketch</h1>
  <AuthButton />
</div> */}

{credits && !credits.hasPro && (
  <p className="text-center text-gray-600">
    {credits.remaining} free diagrams remaining
  </p>
)}
        <InputBox value={description} onChange={setDescription} onSubmit={() => generate()} loading={loading} />

        {suggestions.length > 0 && (
          <div className="mt-8 space-y-3">
            {suggestions.map((s, i) => (
              <Alert key={i} className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{s}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {error && (
          <Alert className="mt-8 border-red-200 bg-red-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mermaid && <DiagramViewer mermaidCode={mermaid} onRefine={() => generate(true)} />}
      </div>
    </main>
  );
}