'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputBox from '@/components/InputBox';
import DiagramViewer from '@/components/DiagramViewer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [description, setDescription] = useState('');
  const [mermaid, setMermaid] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shared = params.get('diagram');
    if (shared) {
      try {
        setMermaid(atob(decodeURIComponent(shared)));
      } catch {}
    }
  }, []);

  const generate = async (refine = false) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, previousMermaid: refine ? mermaid : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMermaid(data.mermaid);
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Header />
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