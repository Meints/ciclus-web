"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { CONTRACT_FREQUENCY_LABELS } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Contract } from "@/types/contract";

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
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => formatCurrency(row.original.value),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ContractStatusBadge status={row.original.status} />,
  },
];

export function ContractTable({ data, isLoading, onRowClick, pagination }: ContractTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
      pagination={pagination}
      emptyTitle="Nenhum contrato encontrado"
      emptyDescription="Ajuste os filtros ou crie um novo contrato."
    />
  );
}
