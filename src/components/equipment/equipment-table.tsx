"use client";

import { PencilIcon, PowerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { EQUIPMENT_STATUS_LABELS, EQUIPMENT_STATUS_VARIANTS, EQUIPMENT_TYPE_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import type { Equipment } from "@/types/equipment";

interface EquipmentTableProps {
  data: Equipment[];
  onEdit: (item: Equipment) => void;
  onToggle: (item: Equipment) => void;
  isToggling?: boolean;
}

export function EquipmentTable({ data, onEdit, onToggle, isToggling }: EquipmentTableProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Nenhum equipamento cadastrado"
        description="Cadastre o primeiro equipamento deste cliente para acompanhar o histórico de manutenções."
      />
    );
  }

  return (
    <div className="divide-y">
      {data.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 p-4">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="font-medium">{EQUIPMENT_TYPE_LABELS[item.type]}</p>
            <p className="text-sm text-muted-foreground">
              {item.brand} {item.model} {item.capacity ? `· ${item.capacity}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.location}
              {item.installationDate ? ` · instalado em ${formatDate(item.installationDate)}` : ""}
            </p>
          </div>
          <StatusBadge
            label={EQUIPMENT_STATUS_LABELS[item.status]}
            variant={EQUIPMENT_STATUS_VARIANTS[item.status]}
          />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isToggling}
              onClick={() => onToggle(item)}
            >
              <PowerIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
