"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { DatesSetArg, EventClickArg, EventInput } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { useCalendarServices } from "@/hooks/use-dashboard";
import type { UpcomingService } from "@/types/dashboard";
import { CalendarHeader, type CalendarViewKey } from "./calendar/calendar-header";
import { CalendarEventContent } from "./calendar/calendar-event-badge";
import { CalendarEventDialog } from "./calendar/calendar-event-popover";

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildEventStart(service: UpcomingService): string {
  const datePart = service.scheduledDate.slice(0, 10);
  if (service.scheduledTime) {
    return `${datePart}T${service.scheduledTime}:00`;
  }
  return datePart;
}

function buildEventEnd(service: UpcomingService): string | undefined {
  if (!service.scheduledTime || !service.estimatedDurationMinutes) return undefined;
  const datePart = service.scheduledDate.slice(0, 10);
  const start = new Date(`${datePart}T${service.scheduledTime}:00`);
  start.setMinutes(start.getMinutes() + service.estimatedDurationMinutes);
  return start.toISOString();
}

function getInitialView(): CalendarViewKey {
  if (typeof window !== "undefined" && window.innerWidth < 768) return "listWeek";
  return "timeGridWeek";
}

function eventVariantForView(viewType: string): "month" | "time" | "list" {
  if (viewType === "listWeek" || viewType === "listMonth" || viewType === "listDay") return "list";
  if (viewType === "dayGridMonth") return "month";
  return "time";
}

export function ServiceCalendar() {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const today = useMemo(() => new Date(), []);
  const [range, setRange] = useState(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { start: toDateOnly(start), end: toDateOnly(end) };
  });
  const [selected, setSelected] = useState<UpcomingService | null>(null);
  const [view, setView] = useState<CalendarViewKey>(getInitialView);
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: services, isLoading } = useCalendarServices(range);

  const daysWithService = useMemo(() => {
    const days = new Set<string>();
    (services ?? []).forEach((service) => days.add(service.scheduledDate.slice(0, 10)));
    return days;
  }, [services]);

  const events: EventInput[] = (services ?? []).map((service) => ({
    id: service.id,
    title: service.customerName,
    start: buildEventStart(service),
    end: buildEventEnd(service),
    allDay: !service.scheduledTime,
    backgroundColor: "transparent",
    borderColor: "transparent",
    extendedProps: { service },
  }));

  function getApi() {
    return calendarRef.current?.getApi();
  }

  function handleEventClick(arg: EventClickArg) {
    setSelected(arg.event.extendedProps.service as UpcomingService);
  }

  function handleDatesSet(arg: DatesSetArg) {
    setRange({ start: toDateOnly(arg.view.activeStart), end: toDateOnly(arg.view.activeEnd) });
    setTitle(arg.view.title);
    setView(arg.view.type as CalendarViewKey);
  }

  function handleChangeView(next: CalendarViewKey) {
    getApi()?.changeView(next);
    setView(next);
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <CalendarHeader
          title={title}
          activeView={view}
          onPrev={() => getApi()?.prev()}
          onNext={() => getApi()?.next()}
          onToday={() => getApi()?.today()}
          onChangeView={handleChangeView}
        />

        {isLoading && (
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2Icon className="h-3 w-3 animate-spin" />
            Carregando agenda...
          </div>
        )}

        <div key={`${view}-${range.start}`} className="ciclus-calendar animate-in fade-in-0 duration-200">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false}
            locale={ptBrLocale}
            height="auto"
            events={events}
            eventClick={handleEventClick}
            dateClick={(arg) =>
              setSelectedDate((prev) => (prev === arg.dateStr ? null : arg.dateStr))
            }
            datesSet={handleDatesSet}
            dayMaxEvents={3}
            dayCellClassNames={(arg) => {
              const dateStr = toDateOnly(arg.date);
              const classes: string[] = [];
              if (daysWithService.has(dateStr)) classes.push("has-service");
              if (selectedDate === dateStr) classes.push("is-selected");
              return classes;
            }}
            eventContent={(arg) => (
              <CalendarEventContent
                service={arg.event.extendedProps.service as UpcomingService}
                variant={eventVariantForView(arg.view.type)}
              />
            )}
            moreLinkContent={(arg) => (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-accent">
                +{arg.num} mais
              </span>
            )}
            slotMinTime="06:00:00"
            slotMaxTime="20:00:00"
            slotDuration="00:30:00"
            allDaySlot={false}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
          />
        </div>
      </CardContent>

      <CalendarEventDialog
        service={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onViewFull={(id) => router.push(`/servicos/${id}`)}
      />
    </Card>
  );
}
