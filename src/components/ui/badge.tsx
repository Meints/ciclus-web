import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ciclus-blue-50 text-ciclus-blue-600",
        secondary: "border-transparent bg-ciclus-gray-100 text-ciclus-gray-600",
        destructive: "border-transparent bg-ciclus-red-50 text-ciclus-red-600",
        outline: "text-foreground",
        success: "border-transparent bg-ciclus-teal-50 text-ciclus-teal-600",
        warning: "border-transparent bg-ciclus-amber-50 text-ciclus-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
