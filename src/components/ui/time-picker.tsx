"use client";

import { useRef } from "react";
import { ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "00:00",
  className,
}: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Mantém só dígitos e limita a 4 caracteres
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);

    if (digits.length === 0) {
      onChange?.("");
      return;
    }

    // Clamp horas ao digitar o segundo dígito
    let h = digits.slice(0, 2);
    if (digits.length >= 2 && parseInt(h) > 23) h = "23";

    if (digits.length <= 2) {
      // Ainda digitando a hora — exibe sem os minutos
      onChange?.(h.length === 2 ? `${h}:` : h);
    } else {
      // Tem minutos também
      let m = digits.slice(2, 4);
      if (digits.length === 4 && parseInt(m) > 59) m = "59";
      onChange?.(`${h}:${m}`);
    }
  }

  // O valor exibido no input é sempre o value (que já inclui ":" quando necessário)
  // mas se terminar em ":" removemos para não confundir o cursor
  const displayValue = value?.endsWith(":") ? value.slice(0, 2) : (value ?? "");

  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-md border border-input bg-card px-3 transition-colors",
        "focus-within:ring-2 focus-within:ring-brand-100 focus-within:ring-offset-0",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        disabled={disabled}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        maxLength={5}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
