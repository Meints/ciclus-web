"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDate } from "@/lib/utils";
import type { Service } from "@/types/service";

interface ServiceTableProps {
  data: Service[];
  isLoading: boolean;
  onRowClick: (service: Service) => void;
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
  },
  {
    accessorKey: "serviceType",
    header: "Tipo",
    cell: ({ row }) => getServiceTypeLabel(row.original.serviceType),
  },
  {
    accessorKey: "scheduledDate",
    header: "Data agendada",
    cell: ({ row }) => formatDate(row.original.scheduledDate),
  },
  {
    accessorKey: "employeeName",
    header: "Técnico",
    cell: ({ row }) => row.original.employeeName ?? "Não atribuído",
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
];

export function ServiceTable({ data, isLoading, onRowClick, pagination }: ServiceTableProps) {
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
