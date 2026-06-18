"use client";

import { useCallback, useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number;
  onChange: (value: number) => void;
}

function parseBRL(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  const padded = digits.padStart(3, "0");
  const cents = padded.slice(-2);
  const integer = padded.slice(0, -2) || "0";
  return Number(`${integer}.${cents}`);
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(() => formatBRL(value));

  useEffect(() => {
    setDisplayValue(formatBRL(value));
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = parseBRL(e.target.value);
      const formatted = formatBRL(numericValue);
      setDisplayValue(formatted);
      onChange(numericValue);
    },
    [onChange],
  );

  useEffect(() => {
    if (inputRef.current) {
      const len = displayValue.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [displayValue]);

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      {...props}
    />
  );
}
