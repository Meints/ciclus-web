"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { CONTRACT_FREQUENCY_LABELS } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Contract } from "@/types/contract";

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(dateStr);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function ExpiryCell({ contract }: { contract: Contract }) {
  const days = daysUntil(contract.endDate);
  const isInactive = contract.status === "CANCELLED" || contract.status === "PAUSED" || contract.status === "EXPIRED";

  if (isInactive || days > 30) {
    return <span>{formatDate(contract.endDate)}</span>;
  }

  const urgencyClass = days <= 7 ? "text-destructive font-semibold" : "text-warning-500 font-medium";

  return (
    <span className="flex flex-col gap-0.5">
      <span>{formatDate(contract.endDate)}</span>
      <span className={`text-xs ${urgencyClass}`}>
        {days <= 0 ? "Hoje" : `em ${days} dia${days !== 1 ? "s" : ""}`}
      </span>
    </span>
  );
}

function getContractRowClass(contract: Contract): string | undefined {
  if (contract.status === "CANCELLED") {
    return "opacity-50";
  }
  if (contract.status === "PAUSED") {
    return "border-l-2 border-l-muted-foreground/40 opacity-60";
  }
  if (contract.status === "EXPIRED") {
    return "border-l-2 border-l-destructive/50 opacity-60";
  }

  // Calcula urgência pelo endDate, independente do status armazenado
  const days = daysUntil(contract.endDate);
  if (days <= 0) {
    return "border-l-2 border-l-destructive/50 bg-destructive/5";
  }
  if (days <= 7) {
    return "border-l-2 border-l-destructive/60 bg-destructive/5";
  }
  if (days <= 30) {
    return "border-l-2 border-l-warning-400 bg-warning-50/40 hover:bg-warning-50/60";
  }

  return undefined;
}

interface ContractTableProps {
  data: Contract[];
  isLoading: boolean;
  onRowClick: (contract: Contract) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "customerName",
    header: "Cliente",
    cell: ({ row }) => (
      <span className={row.original.status === "CANCELLED" ? "line-through text-muted-foreground" : "font-medium"}>
        {row.original.customerName}
      </span>
    ),
  },
  {
    accessorKey: "frequency",
    header: "Periodicidade",
    cell: ({ row }) => CONTRACT_FREQUENCY_LABELS[row.original.frequency],
  },
  {
    accessorKey: "nextVisitDate",
    header: "Próxima visita",
    cell: ({ row }) =>
      row.original.nextVisitDate ? formatDate(row.original.nextVisitDate) : "—",
  },
  {
    accessorKey: "endDate",
    header: "Vencimento",
    cell: ({ row }) => <ExpiryCell contract={row.original} />,
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => formatCurrency(row.original.value),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ContractStatusBadge contract={row.original} />,
  },
];

export function ContractTable({ data, isLoading, onRowClick, pagination }: ContractTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
      getRowClassName={getContractRowClass}
      pagination={pagination}
      emptyTitle="Nenhum contrato encontrado"
      emptyDescription="Ajuste os filtros ou crie um novo contrato."
    />
  );
}
