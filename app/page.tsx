// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import InputBox from "@/components/InputBox";
import DiagramViewer from "@/components/DiagramViewer";
import PricingModal from "@/components/PricingModal";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { isValidArchitectureDescription } from "@/utils/validateDescription";

const supabase = createClient();

export default function Home() {
  const [description, setDescription] = useState("");
  const [mermaid, setMermaid] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<{ remaining: number } | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  // Load user + credits
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchCredits();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchCredits();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Auto-open pricing modal if out of credits
  useEffect(() => {
    if (credits && credits.remaining <= 0) {
      setShowPricing(true);
    }
  }, [credits]);

  // Handle ?bought=true after Stripe redirect
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("bought") === "true") {
      fetchCredits();
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    if (mermaid) {
      // Small delay so the diagram has time to render
      const timer = setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [mermaid]);

  const fetchCredits = async () => {
    if (!user) return;
    const res = await fetch("/api/credits");
    if (res.ok) {
      const data = await res.json();
      setCredits({ remaining: data.remaining });
    }
  };

  const generate = async (refine = false) => {
    if (!user) {
      supabase.auth.signInWithOAuth({ provider: "google" });
      return;
    }

    const validation = isValidArchitectureDescription(description);
    if (!validation.valid) {
      setError(validation.reason!);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if user has credits
      const permissionRes = await fetch("/api/credits", { method: "POST" });
      const { allowed, upgrade } = await permissionRes.json();

      if (!allowed || upgrade) {
        setShowPricing(true);
        setLoading(false);
        return;
      }

      // Generate diagram
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          previousMermaid: refine ? mermaid : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");

      setMermaid(data.mermaid);
      setSuggestions(data.suggestions || []);
      fetchCredits(); // Update remaining credits
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="max-w-5xl mx-auto px-6">
        <Navbar />
        <Header />
        <InputBox
          value={description}
          onChange={setDescription}
          onSubmit={() => generate()}
          loading={loading}
        />

        {/* === CREDITS DISPLAY – ALWAYS VISIBLE === */}
        {user && credits !== null && (
          <div className="my-10 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-8 py-6 rounded-2xl shadow-lg border-2 border-gray-200">
              <div className="text-5xl font-black text-blue-600">
                {credits.remaining}
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-gray-800">credits</div>
                <div className="text-sm text-gray-600">remaining</div>
              </div>
            </div>

            {credits.remaining <= 0 ? (
              <div className="mt-4">
                <button
                  onClick={() => setShowPricing(true)}
                  className="text-xl font-bold text-red-600 hover:text-red-700 underline"
                >
                  Out of credits – Buy more →
                </button>
              </div>
            ) : credits.remaining <= 5 ? (
              <div className="mt-4">
                <button
                  onClick={() => setShowPricing(true)}
                  className="text-lg font-medium text-orange-600 hover:text-orange-700 underline"
                >
                  Running low – Buy more credits →
                </button>
              </div>
            ) : null}
          </div>
        )}

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

        {mermaid && (
          <DiagramViewer
            mermaidCode={mermaid}
            onRefine={() => generate(true)}
          />
        )}

        {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
      </div>
    </main>
  );
}
