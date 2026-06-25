"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarViewKey = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek";

const VIEW_OPTIONS: { key: CalendarViewKey; label: string }[] = [
  { key: "dayGridMonth", label: "Mês" },
  { key: "timeGridWeek", label: "Semana" },
  { key: "timeGridDay", label: "Dia" },
  { key: "listWeek", label: "Lista" },
];

interface CalendarHeaderProps {
  title: string;
  activeView: CalendarViewKey;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onChangeView: (view: CalendarViewKey) => void;
}

export function CalendarHeader({
  title,
  activeView,
  onPrev,
  onNext,
  onToday,
  onChangeView,
}: CalendarHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-full" onClick={onToday}>
          Hoje
        </Button>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onPrev}
            aria-label="Período anterior"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onNext}
            aria-label="Próximo período"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-sm font-semibold capitalize text-foreground sm:text-base">
          {title}
        </h2>
      </div>

      <div
        role="group"
        aria-label="Visualização do calendário"
        className="flex items-center gap-0.5 rounded-full border border-border bg-muted/60 p-0.5"
      >
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={activeView === option.key}
            onClick={() => onChangeView(option.key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-100",
              activeView === option.key
                ? "bg-card text-brand-700 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
