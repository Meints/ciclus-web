"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EMPLOYEE_STATUS_LABELS, EMPLOYEE_STATUS_VARIANTS } from "@/lib/labels";
import { getRoleLabel } from "@/lib/auth";
import type { Employee } from "@/types/employee";

interface EmployeeTableProps {
  data: Employee[];
  isLoading: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "role",
    header: "Função",
    cell: ({ row }) => getRoleLabel(row.original.role),
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "servicesThisMonth",
    header: "OS do mês",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        label={EMPLOYEE_STATUS_LABELS[row.original.status]}
        variant={EMPLOYEE_STATUS_VARIANTS[row.original.status]}
      />
    ),
  },
];

export function EmployeeTable({ data, isLoading, pagination }: EmployeeTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      pagination={pagination}
      emptyTitle="Nenhum membro na equipe"
      emptyDescription="Adicione colaboradores para atribuir contratos e ordens de serviço."
    />
  );
}
