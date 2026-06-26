import { cn } from "@/lib/utils";
import { getServiceTypeLabel } from "@/lib/service-types";
import { CALENDAR_STATUS_STYLES } from "./calendar-status";
import type { UpcomingService } from "@/types/dashboard";

interface CalendarEventContentProps {
  service: UpcomingService;
  variant: "month" | "time" | "list";
}

export function CalendarEventContent({ service, variant }: CalendarEventContentProps) {
  const style = CALENDAR_STATUS_STYLES[service.status];
  const time = service.scheduledTime?.slice(0, 5);

  if (variant === "list") {
    return (
      <span className="flex min-w-0 items-center gap-2 text-sm">
        <span className={cn("h-2 w-2 shrink-0 rounded-full", style.dot)} />
        <span className="truncate font-medium">{service.customerName}</span>
        <span className="hidden shrink-0 text-muted-foreground sm:inline">
          · {getServiceTypeLabel(service.serviceType)}
        </span>
      </span>
    );
  }

  if (variant === "month") {
    return (
      <div
        className={cn(
          "flex w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
          style.chipBg,
          style.chipBorder,
          style.text
        )}
      >
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
        {time && <span className="shrink-0 tabular-nums">{time}</span>}
        <span className="min-w-0 truncate">{service.customerName}</span>
      </div>
    );
  }

  // time variant — single-row layout so content is always visible regardless of cell height
  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-md border px-1.5 py-0.5 text-[11px]",
        style.chipBg,
        style.chipBorder,
        style.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
      {time && <span className="shrink-0 tabular-nums font-medium">{time}</span>}
      <span className="min-w-0 truncate font-semibold">{service.customerName}</span>
      <span className="hidden min-w-0 truncate opacity-70 sm:block">
        · {getServiceTypeLabel(service.serviceType)}
      </span>
    </div>
  );
}
