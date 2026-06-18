"use client";

import { PlayCircleIcon, CheckCircle2Icon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDateShort } from "@/lib/utils";
import type { Service } from "@/types/service";

interface ServiceTableProps {
  data: Service[];
  isLoading: boolean;
  onRowClick: (service: Service) => void;
  onStart?: (service: Service) => void;
  onComplete?: (service: Service) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "customerName",
    header: "Cliente",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.customerName}</p>
        <p className="text-xs text-muted-foreground">
          {getServiceTypeLabel(row.original.serviceType)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "scheduledDate",
    header: "Data",
    cell: ({ row }) => (
      <span className="text-sm">{formatDateShort(row.original.scheduledDate)}</span>
    ),
  },
  {
    accessorKey: "employeeName",
    header: "Técnico",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.employeeName ?? "—"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={SERVICE_STATUS_LABELS[row.original.status]}
        variant={SERVICE_STATUS_VARIANTS[row.original.status]}
      />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const service = row.original;
      if (service.status === "SCHEDULED") {
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-brand-600"
            title="Iniciar execução"
          >
            <PlayCircleIcon className="h-4 w-4" />
          </Button>
        );
      }
      if (service.status === "IN_PROGRESS") {
        return (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-success-600"
            title="Concluir"
          >
            <CheckCircle2Icon className="h-4 w-4" />
          </Button>
        );
      }
      return null;
    },
  },
];

export function ServiceTable({ data, isLoading, onRowClick, onStart, onComplete, pagination }: ServiceTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
      pagination={pagination}
      emptyTitle="Nenhuma ordem de serviço encontrada"
      emptyDescription="Ajuste os filtros para ver outras ordens de serviço."
    />
  );
}
