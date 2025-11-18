import { cn } from "@/lib/utils";


// components/ui/card.tsx
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border bg-white shadow-sm", className)}>{children}</div>;
}