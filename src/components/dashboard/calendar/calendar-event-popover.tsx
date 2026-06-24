"use client";

import type { ComponentType } from "react";
import { CalendarIcon, ClockIcon, UserIcon, WrenchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServiceTypeLabel } from "@/lib/service-types";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import type { UpcomingService } from "@/types/dashboard";

interface CalendarEventDialogProps {
  service: UpcomingService | null;
  onOpenChange: (open: boolean) => void;
  onViewFull: (id: string) => void;
}

export function CalendarEventDialog({
  service,
  onOpenChange,
  onViewFull,
}: CalendarEventDialogProps) {
  return (
    <Dialog open={Boolean(service)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-4 rounded-xl">
        {service && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2 pr-6">
                <DialogTitle>{service.customerName}</DialogTitle>
                <Badge variant={SERVICE_STATUS_VARIANTS[service.status]}>
                  {SERVICE_STATUS_LABELS[service.status]}
                </Badge>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-3 text-sm">
              <DetailRow icon={WrenchIcon} label="Serviço" value={getServiceTypeLabel(service.serviceType)} />
              <DetailRow icon={UserIcon} label="Técnico" value={service.employeeName ?? "Não atribuído"} />
              <DetailRow icon={CalendarIcon} label="Data" value={formatDate(service.scheduledDate)} />
              <DetailRow
                icon={ClockIcon}
                label="Horário"
                value={
                  service.scheduledTime
                    ? `${service.scheduledTime.slice(0, 5)}${
                        service.estimatedDurationMinutes
                          ? ` (${service.estimatedDurationMinutes}min)`
                          : ""
                      }`
                    : "Sem horário"
                }
              />
            </div>

            <DialogFooter>
              <Button onClick={() => onViewFull(service.id)}>Ver OS completa</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex flex-col">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="font-medium leading-tight">{value}</span>
      </div>
    </div>
  );
}
