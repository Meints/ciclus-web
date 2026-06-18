"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number | null | undefined;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: "default" | "warning" | "danger" | "success";
  onClick?: () => void;
  loading?: boolean;
}

export function KpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  onClick,
  loading,
}: KpiCardProps) {
  const displayValue =
    value == null || value === "" || (typeof value === "number" && (isNaN(value) || !isFinite(value)))
      ? "—"
      : value;
  const variantStyles = {
    default: {
      bg: "bg-brand-50 dark:bg-brand-950",
      text: "text-brand-600",
      icon: "text-brand-600",
    },
    success: {
      bg: "bg-success-50 dark:bg-success-900",
      text: "text-success-600",
      icon: "text-success-600",
    },
    warning: {
      bg: "bg-warning-50 dark:bg-warning-600/30",
      text: "text-warning-600",
      icon: "text-warning-600",
    },
    danger: {
      bg: "bg-danger-50 dark:bg-danger-600/30",
      text: "text-danger-600",
      icon: "text-danger-600",
    },
  };

  const s = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg border-[0.5px] border-ciclus-gray-100 bg-white p-5 transition-all dark:border-border dark:bg-card",
        onClick && "cursor-pointer hover:shadow-md hover:border-brand-200 dark:hover:border-brand-600",
      )}
    >
      {loading ? (
        <div className="flex flex-col gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-7 w-16 animate-pulse rounded bg-muted" />
        </div>
      ) : (
        <>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", s.bg, s.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{label}</p>
          <div className="flex items-end gap-2">
            <p className={cn("text-[28px] font-medium leading-tight", s.text)}>
              {displayValue}
            </p>
            {trend && (
              <span
                className={cn(
                  "mb-1 text-xs font-medium",
                  trend.positive ? "text-success-600" : "text-danger-600",
                )}
              >
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </>
      )}
    </div>
  );
}
