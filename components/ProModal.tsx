// components/ProModal.tsx
"use client";

import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export default function ProModal({ onUpgrade }: { onUpgrade: () => void }) {
  const upgrade = async () => {
    const res = await fetch("/api/create-checkout", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
        <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">
          You've used your 2 free diagrams!
        </h2>
        <p className="text-gray-600 mb-8">
          Upgrade to Pro for unlimited AI architecture diagrams.
        </p>
        <Button size="lg" onClick={upgrade} className="w-full">
          Upgrade to Pro – $7.99/month
        </Button>
        <button
          onClick={onUpgrade}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
