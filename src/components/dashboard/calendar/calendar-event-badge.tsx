import { ClockIcon } from "lucide-react";
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
      <span className="flex items-center gap-2 truncate text-sm">
        <span className={cn("h-2 w-2 shrink-0 rounded-full", style.dot)} />
        <span className="truncate font-medium">{service.customerName}</span>
        <span className="truncate text-muted-foreground">
          · {getServiceTypeLabel(service.serviceType)}
        </span>
      </span>
    );
  }

  if (variant === "month") {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-1.5 truncate rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
          style.chipBg,
          style.chipBorder,
          style.text
        )}
      >
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
        {time && <span className="shrink-0 tabular-nums">{time}</span>}
        <span className="truncate">{service.customerName}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-0.5 overflow-hidden rounded-md border px-2 py-1 text-xs",
        style.chipBg,
        style.chipBorder,
        style.text
      )}
    >
      <span className="flex items-center gap-1 truncate font-semibold">
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
        {service.customerName}
      </span>
      <span className="truncate text-[11px] opacity-80">
        {getServiceTypeLabel(service.serviceType)}
      </span>
      {time && (
        <span className="mt-auto flex items-center gap-1 text-[11px] opacity-70">
          <ClockIcon className="h-3 w-3" /> {time}
        </span>
      )}
    </div>
  );
}
