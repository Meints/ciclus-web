"use client";

import { useRouter } from "next/navigation";
import { ClockIcon, PlayCircleIcon, CheckCircle2Icon, XCircleIcon, UserIcon, CalendarIcon } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDateShort } from "@/lib/utils";
import type { Service } from "@/types/service";

interface ServiceKanbanProps {
  services: Service[];
  isLoading: boolean;
}

const COLUMNS = [
  { status: "SCHEDULED", label: "Agendado", icon: ClockIcon, color: "border-l-brand-400" },
  { status: "IN_PROGRESS", label: "Em andamento", icon: PlayCircleIcon, color: "border-l-warning-500" },
  { status: "COMPLETED", label: "Concluído", icon: CheckCircle2Icon, color: "border-l-success-500" },
  { status: "CANCELLED", label: "Cancelado", icon: XCircleIcon, color: "border-l-gray-400" },
] as const;

export function ServiceKanban({ services, isLoading }: ServiceKanbanProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 overflow-x-auto md:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="flex flex-col gap-3">
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const Icon = column.icon;
        const columnServices = services.filter((s) => s.status === column.status);

        return (
          <div key={column.status} className="flex min-w-[260px] flex-1 flex-col gap-3">
            <div className={`flex items-center gap-2 border-l-4 ${column.color} pl-3`}>
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{column.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {columnServices.length}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {columnServices.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  Nenhum serviço
                </p>
              ) : (
                columnServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => router.push(`/servicos/${service.id}`)}
                    className="flex flex-col gap-2 rounded-lg border bg-white p-3 text-left text-sm shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium leading-tight">{service.customerName}</p>
                      <StatusBadge
                        label={SERVICE_STATUS_LABELS[service.status]}
                        variant={SERVICE_STATUS_VARIANTS[service.status]}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {getServiceTypeLabel(service.serviceType)}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDateShort(service.scheduledDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {service.employeeName ?? "—"}
                      </span>
                    </div>

                    {service.equipmentDetails && service.equipmentDetails.length > 0 && (
                      <p className="truncate text-xs text-muted-foreground">
                        {service.equipmentDetails.length} equipamento(s)
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
