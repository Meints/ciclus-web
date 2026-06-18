"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface Props {
  masked: string;
  onReveal?: () => Promise<string | null>;
  canReveal?: boolean;
}

export function SensitiveData({ masked, onReveal, canReveal = true }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unmaskedValue, setUnmaskedValue] = useState<string | null>(null);

  const handleReveal = useCallback(async () => {
    if (!onReveal || unmaskedValue) return;
    setLoading(true);
    try {
      const value = await onReveal();
      if (value !== null) {
        setUnmaskedValue(value);
        setRevealed(true);
      }
    } finally {
      setLoading(false);
    }
  }, [onReveal, unmaskedValue]);

  useEffect(() => {
    if (!revealed || !unmaskedValue) return;
    const timer = setTimeout(() => {
      setRevealed(false);
      setUnmaskedValue(null);
    }, 30000);
    return () => clearTimeout(timer);
  }, [revealed, unmaskedValue]);

  useEffect(() => {
    setRevealed(false);
    setUnmaskedValue(null);
  }, [masked]);

  if (!masked) return <span className="text-muted-foreground">---</span>;

  const displayValue = revealed && unmaskedValue ? unmaskedValue : masked;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{loading ? "..." : displayValue}</span>
      {canReveal && (
        <button
          type="button"
          onClick={revealed ? () => { setRevealed(false); setUnmaskedValue(null); } : handleReveal}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={revealed ? "Ocultar" : "Revelar"}
        >
          {loading ? (
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : revealed ? (
            <EyeOff size={14} />
          ) : (
            <Eye size={14} />
          )}
        </button>
      )}
      {!canReveal && (
        <Lock size={14} className="text-muted-foreground" />
      )}
    </span>
  );
}
