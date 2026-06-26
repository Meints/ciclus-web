"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { ContractStatusBadge, computeContractStatus } from "@/components/contracts/contract-status-badge";
import { CONTRACT_FREQUENCY_LABELS } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Contract } from "@/types/contract";

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Extrai só a parte da data (YYYY-MM-DD) e cria em horário local, evitando offset UTC
  const datePart = dateStr.split("T")[0]!;
  const [y, m, d] = datePart.split("-").map(Number) as [number, number, number];
  const end = new Date(y, m - 1, d);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function ExpiryCell({ contract }: { contract: Contract }) {
  const days = daysUntil(contract.endDate);
  const isInactive = contract.status === "CANCELLED" || contract.status === "PAUSED";

  // Contratos inativos ou com vencimento muito distante/muito antigo: só a data
  if (isInactive || days > 30 || days < -30) {
    return <span>{formatDate(contract.endDate)}</span>;
  }

  const urgencyClass =
    days <= 0 ? "text-destructive font-semibold" :
    days <= 7 ? "text-destructive font-semibold" :
    "text-warning-500 font-medium";

  let label: string;
  if (days < 0) {
    const n = Math.abs(days);
    label = `Vencido há ${n} dia${n !== 1 ? "s" : ""}`;
  } else if (days === 0) {
    label = "Vence hoje";
  } else {
    label = `em ${days} dia${days !== 1 ? "s" : ""}`;
  }

  return (
    <span className="flex flex-col gap-0.5">
      <span>{formatDate(contract.endDate)}</span>
      <span className={`text-xs ${urgencyClass}`}>{label}</span>
    </span>
  );
}

function getContractRowClass(contract: Contract): string | undefined {
  const status = computeContractStatus(contract);

  switch (status) {
    case "EXPIRED":
      return "border-l-2 border-l-destructive bg-destructive/5 hover:bg-destructive/10";
    case "ABOUT_TO_EXPIRE":
      return "border-l-2 border-l-warning-400 bg-warning-50/50 hover:bg-warning-50/80";
    case "PAUSED":
      return "border-l-2 border-l-muted-foreground/40 bg-muted/20 opacity-70";
    case "CANCELLED":
      // Sem borda, apenas opacidade reduzida
      return "opacity-40";
    default:
      return undefined;
  }
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
