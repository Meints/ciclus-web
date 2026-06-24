import type { ServiceStatus } from "@/types/service";

interface CalendarStatusStyle {
  dot: string;
  text: string;
  chipBg: string;
  chipBorder: string;
}

export const CALENDAR_STATUS_STYLES: Record<ServiceStatus, CalendarStatusStyle> = {
  SCHEDULED: {
    dot: "bg-brand-500",
    text: "text-brand-700",
    chipBg: "bg-brand-50",
    chipBorder: "border-brand-200",
  },
  CONFIRMED: {
    dot: "bg-success-500",
    text: "text-success-700",
    chipBg: "bg-success-50",
    chipBorder: "border-success-200",
  },
  IN_PROGRESS: {
    dot: "bg-warning-500",
    text: "text-warning-600",
    chipBg: "bg-warning-50",
    chipBorder: "border-warning-400/40",
  },
  RESCHEDULED: {
    dot: "bg-warning-500",
    text: "text-warning-600",
    chipBg: "bg-warning-50",
    chipBorder: "border-warning-400/40",
  },
  COMPLETED: {
    dot: "bg-success-500",
    text: "text-success-700",
    chipBg: "bg-success-50",
    chipBorder: "border-success-200",
  },
  CANCELLED: {
    dot: "bg-danger-500",
    text: "text-danger-600",
    chipBg: "bg-danger-50",
    chipBorder: "border-danger-500/30",
  },
  NOT_FOUND: {
    dot: "bg-danger-500",
    text: "text-danger-600",
    chipBg: "bg-danger-50",
    chipBorder: "border-danger-500/30",
  },
};
