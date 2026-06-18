import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border-[0.5px] border-input bg-background px-3 py-1 text-[13px] shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ciclus-gray-400 focus-visible:border-ciclus-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ciclus-blue-50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
