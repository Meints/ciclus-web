import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border-[0.5px] border-input bg-background px-3 py-2 text-[13px] shadow-none placeholder:text-ciclus-gray-400 focus-visible:border-ciclus-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ciclus-blue-50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
