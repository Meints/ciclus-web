"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

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
        MonthCaption: ({ calendarMonth, displayIndex: _di, ...divProps }) => {
          const label = format(calendarMonth.date, "MMMM yyyy", {
            locale: ptBR,
          });
          const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
          return <div {...divProps}>{capitalized}</div>;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
