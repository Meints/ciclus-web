"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomers } from "@/hooks/use-customers";
import { cn } from "@/lib/utils";

interface CustomerComboboxProps {
  value?: string;
  onChange: (customerId: string) => void;
  placeholder?: string;
}

export function CustomerCombobox({
  value,
  onChange,
  placeholder = "Selecione o cliente",
}: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCustomers({ page: 1, pageSize: 10, search });
  const selected = data?.data.find((customer) => customer.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn(!selected && "text-muted-foreground")}>
            {selected ? selected.legalName : placeholder}
          </span>
          <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2">
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {isLoading && <p className="p-2 text-sm text-muted-foreground">Buscando...</p>}
          {!isLoading && (data?.data.length ?? 0) === 0 && (
            <p className="p-2 text-sm text-muted-foreground">Nenhum cliente encontrado</p>
          )}
          {data?.data.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => {
                onChange(customer.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                value === customer.id && "bg-accent"
              )}
            >
              <CheckIcon
                className={cn("h-4 w-4", value === customer.id ? "opacity-100" : "opacity-0")}
              />
              {customer.legalName}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
