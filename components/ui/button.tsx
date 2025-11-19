import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "destructive" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

    const variants: Record<Variant, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline:
        "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
