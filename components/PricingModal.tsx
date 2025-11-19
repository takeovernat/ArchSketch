// components/PricingModal.tsx
"use client";

import { Sparkles } from "lucide-react";

export default function PricingModal({ onClose }: { onClose: () => void }) {
  const STARTER_PRICE_ID = process.env.NEXT_PUBLIC_PRICE_STARTER!;
  const PRO_PRICE_ID = process.env.NEXT_PUBLIC_PRICE_PRO!;
  const BEAST_PRICE_ID = process.env.NEXT_PUBLIC_PRICE_BEAST!;

  const buy = async (credits: number, priceId: string) => {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, credits }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Buy Credits</h2>
        <div className="space-y-4">
          <button
            onClick={() => buy(50, STARTER_PRICE_ID)}
            className="w-full p-6 border rounded-xl hover:bg-gray-50"
          >
            <div className="text-2xl font-bold">$2.99</div>
            <div className="text-gray-600">50 credits</div>
          </button>
          <button
            onClick={() => buy(150, PRO_PRICE_ID)}
            className="relative w-full p-6 border rounded-xl hover:bg-gray-50"
          >
            <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Popular
            </span>
            <div className="text-2xl font-bold">$5.99</div>
            <div className="text-gray-600">150 credits</div>
          </button>
          <button
            onClick={() => buy(500, BEAST_PRICE_ID)}
            className="w-full p-6 border rounded-xl hover:bg-gray-50"
          >
            <div className="text-2xl font-bold">$9.99</div>
            <div className="text-gray-600">500 credits</div>
          </button>
        </div>
        <button onClick={onClose} className="mt-6 text-sm text-gray-500">
          Maybe later
        </button>
      </div>
    </div>
  );
}
