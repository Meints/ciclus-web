"use client";

import { format, setMonth, setYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker, useDayPicker } from "react-day-picker";
import type { CalendarMonth } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTH_NAMES = Array.from({ length: 12 }, (_, i) => {
  const label = format(new Date(2000, i, 1), "MMMM", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
});

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => THIS_YEAR - 5 + i);

function MonthYearCaption({ calendarMonth }: { calendarMonth: CalendarMonth }) {
  const { goToMonth } = useDayPicker();
  const date = calendarMonth.date;

  return (
    <div className="flex h-9 items-center gap-0.5">
      <Select
        value={String(date.getMonth())}
        onValueChange={(v) => goToMonth(setMonth(date, Number(v)))}
      >
        <SelectTrigger className="h-8 w-auto border-0 bg-transparent px-2 text-sm font-medium shadow-none hover:bg-accent focus:ring-0 [&>span]:flex [&>span]:items-center [&_svg]:ml-1 [&_svg]:h-3 [&_svg]:w-3 [&_svg]:opacity-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTH_NAMES.map((name, i) => (
            <SelectItem key={i} value={String(i)}>{name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(date.getFullYear())}
        onValueChange={(v) => goToMonth(setYear(date, Number(v)))}
      >
        <SelectTrigger className="h-8 w-auto border-0 bg-transparent px-2 text-sm font-medium shadow-none hover:bg-accent focus:ring-0 [&_svg]:ml-1 [&_svg]:h-3 [&_svg]:w-3 [&_svg]:opacity-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={className}
      components={{
        MonthCaption: MonthYearCaption,
      }}
      {...props}
    />
  );
}

export { Calendar };
