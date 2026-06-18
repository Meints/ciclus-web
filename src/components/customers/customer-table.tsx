"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_VARIANTS } from "@/lib/labels";
import { maskDocumentPrivacy } from "@/lib/privacy-mask";
import type { Customer } from "@/types/customer";

interface CustomerTableProps {
  data: Customer[];
  isLoading: boolean;
  onRowClick: (customer: Customer) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "legalName",
    header: "Nome",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.legalName}</p>
        {row.original.tradeName && (
          <p className="text-xs text-muted-foreground">{row.original.tradeName}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "document",
    header: "CNPJ/CPF",
    cell: ({ row }) => maskDocumentPrivacy(row.original.document, row.original.documentType),
  },
  {
    accessorKey: "city",
    header: "Cidade",
    cell: ({ row }) => `${row.original.address.city} - ${row.original.address.state}`,
  },
  {
    accessorKey: "contractsCount",
    header: "Contratos",
    cell: ({ row }) => row.original.contractsCount,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={CUSTOMER_STATUS_LABELS[row.original.status]}
        variant={CUSTOMER_STATUS_VARIANTS[row.original.status]}
      />
    ),
  },
];

export function CustomerTable({ data, isLoading, onRowClick, pagination }: CustomerTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={onRowClick}
      pagination={pagination}
      emptyTitle="Nenhum cliente cadastrado"
      emptyDescription="Cadastre o primeiro cliente para começar a gerar contratos e ordens de serviço."
    />
  );
}
