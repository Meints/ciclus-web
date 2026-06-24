"use client";

import {
  CalendarClockIcon,
  CheckCircle2Icon,
  HistoryIcon,
  Loader2Icon,
  PencilIcon,
  PlayCircleIcon,
  PlusCircleIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServiceHistory } from "@/hooks/use-services";
import { SERVICE_STATUS_LABELS } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";
import type { ServiceHistoryEntry } from "@/types/service";
import type { ServiceStatus } from "@/types/service";

const ACTION_META: Record<string, { label: string; icon: typeof HistoryIcon }> = {
  CREATE: { label: "Ordem de serviço criada", icon: PlusCircleIcon },
  UPDATE: { label: "Dados da OS editados", icon: PencilIcon },
  START: { label: "Execução iniciada", icon: PlayCircleIcon },
  REVERT: { label: "Revertida para agendado", icon: RotateCcwIcon },
  REOPEN: { label: "Reaberta", icon: RotateCcwIcon },
  COMPLETE: { label: "Execução concluída", icon: CheckCircle2Icon },
  CANCEL: { label: "Ordem de serviço cancelada", icon: XCircleIcon },
  RESCHEDULE: { label: "Reagendada", icon: CalendarClockIcon },
};

function statusLabel(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return SERVICE_STATUS_LABELS[value as ServiceStatus] ?? value;
}

function describeChange(entry: ServiceHistoryEntry): string | null {
  const oldStatus = statusLabel(entry.oldData?.status);
  const newStatus = statusLabel(entry.newData?.status);

  if (oldStatus && newStatus && oldStatus !== newStatus) {
    return `${oldStatus} → ${newStatus}`;
  }

  if (entry.action === "CANCEL" && typeof entry.newData?.reason === "string") {
    return `Motivo: ${entry.newData.reason}`;
  }

  if (entry.action === "RESCHEDULE" && typeof entry.newData?.scheduledAt === "string") {
    return `Nova data: ${formatDateTime(entry.newData.scheduledAt)}`;
  }

  return null;
}

function HistoryRow({ entry, isLast }: { entry: ServiceHistoryEntry; isLast: boolean }) {
  const meta = ACTION_META[entry.action] ?? { label: entry.action, icon: HistoryIcon };
  const Icon = meta.icon;
  const change = describeChange(entry);

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className="flex flex-col gap-0.5 pb-4">
        <p className="text-sm font-medium leading-tight">{meta.label}</p>
        {change && <p className="text-sm text-muted-foreground">{change}</p>}
        <p className="text-xs text-muted-foreground">
          {entry.userName ?? "Sistema"} · {formatDateTime(entry.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function ServiceHistory({ serviceId }: { serviceId: string }) {
  const { data: history, isLoading } = useServiceHistory(serviceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de alterações</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2Icon className="h-3 w-3 animate-spin" />
            Carregando histórico...
          </div>
        ) : !history || history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma alteração registrada ainda.</p>
        ) : (
          <div className="flex flex-col">
            {history.map((entry, index) => (
              <HistoryRow key={entry.id} entry={entry} isLast={index === history.length - 1} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
