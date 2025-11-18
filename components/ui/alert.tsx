import { cn } from "@/lib/utils";

// components/ui/alert.tsx

export function Alert({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border p-4", className)}>{children}</div>;
}
export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm">{children}</p>;
}