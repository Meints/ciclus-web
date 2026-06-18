"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import { useCalendarServices } from "@/hooks/use-dashboard";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDateTime } from "@/lib/utils";
import type { ServiceStatus } from "@/types/service";
import type { UpcomingService } from "@/types/dashboard";

const STATUS_COLORS: Record<ServiceStatus, string> = {
  SCHEDULED: "#185FA5",
  IN_PROGRESS: "#854F0B",
  COMPLETED: "#0F6E56",
  CANCELLED: "#A32D2D",
};

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function ServiceCalendar() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [range, setRange] = useState(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { start: toDateOnly(start), end: toDateOnly(end) };
  });
  const [selected, setSelected] = useState<UpcomingService | null>(null);

  const { data: services, isLoading } = useCalendarServices(range);

  const events: EventInput[] = (services ?? []).map((service) => ({
    id: service.id,
    title: `${service.customerName} — ${getServiceTypeLabel(service.serviceType)}`,
    start: service.scheduledDate,
    backgroundColor: STATUS_COLORS[service.status],
    borderColor: STATUS_COLORS[service.status],
    extendedProps: { service },
  }));

  function handleEventClick(arg: EventClickArg) {
    const service = arg.event.extendedProps.service as UpcomingService;
    setSelected(service);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading && (
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2Icon className="h-3 w-3 animate-spin" />
            Carregando agenda...
          </div>
        )}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listWeek",
          }}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            list: "Lista",
          }}
          locale="pt-br"
          height="auto"
          events={events}
          eventClick={handleEventClick}
          datesSet={(arg) => {
            setRange({
              start: toDateOnly(arg.view.activeStart),
              end: toDateOnly(arg.view.activeEnd),
            });
          }}
        />
      </CardContent>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selected?.customerName}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-2 text-sm">
              <p>
                <span className="text-muted-foreground">Serviço: </span>
                {getServiceTypeLabel(selected.serviceType)}
              </p>
              <p>
                <span className="text-muted-foreground">Técnico: </span>
                {selected.employeeName ?? "Não atribuído"}
              </p>
              <p>
                <span className="text-muted-foreground">Horário: </span>
                {formatDateTime(selected.scheduledDate)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (selected) router.push(`/servicos/${selected.id}`);
              }}
            >
              Ver OS completa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
