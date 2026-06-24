"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardListIcon,
  FileTextIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ActionItem {
  id: string;
  label: string;
  description: string;
  icon: typeof SearchIcon;
  href?: string;
  action?: () => void;
  shortcut?: string;
}

interface QuickActionBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickActionBar({ open, onOpenChange }: QuickActionBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions: ActionItem[] = [
    {
      id: "new-os",
      label: "Nova ordem de serviço",
      description: "Criar uma OS agendada ou imediata",
      icon: PlusIcon,
      href: "/servicos?quickCreate=true",
      shortcut: "N",
    },
    {
      id: "new-client",
      label: "Novo cliente",
      description: "Cadastrar um cliente",
      icon: PlusIcon,
      href: "/clientes?quickCreate=true",
      shortcut: "C",
    },
    {
      id: "new-contract",
      label: "Novo contrato",
      description: "Criar um contrato recorrente",
      icon: PlusIcon,
      href: "/contratos?quickCreate=true",
      shortcut: "K",
    },
    {
      id: "go-services",
      label: "Ir para Serviços",
      description: "Ver todas as ordens de serviço",
      icon: ClipboardListIcon,
      href: "/servicos",
    },
    {
      id: "go-clients",
      label: "Ir para Clientes",
      description: "Ver todos os clientes cadastrados",
      icon: UsersIcon,
      href: "/clientes",
    },
    {
      id: "go-contracts",
      label: "Ir para Contratos",
      description: "Ver todos os contratos",
      icon: FileTextIcon,
      href: "/contratos",
    },
  ];

  const filtered = query.trim()
    ? actions.filter(
        (a) =>
          a.label.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()),
      )
    : actions;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = useCallback(
    (item: ActionItem) => {
      onOpenChange(false);
      if (item.action) item.action();
      else if (item.href) router.push(item.href);
    },
    [onOpenChange, router],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[15%] max-w-lg gap-0 p-0 sm:top-[20%]">
        <DialogHeader className="sr-only">
          <DialogTitle>Ações rápidas</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 border-b px-4 py-3">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar ações ou criar..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Nenhum resultado encontrado
            </div>
          )}

          {filtered.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                  index === selectedIndex
                    ? "bg-brand-50 text-brand-600"
                    : "hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    index === selectedIndex ? "bg-brand-100" : "bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {item.shortcut && (
                  <kbd className="rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
