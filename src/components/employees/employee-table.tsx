"use client";

import { PencilIcon, PowerIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { EMPLOYEE_STATUS_LABELS, EMPLOYEE_STATUS_VARIANTS } from "@/lib/labels";
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
  onEdit?: (employee: Employee) => void;
  onToggle?: (employee: Employee) => void;
  isToggling?: boolean;
}

export function EmployeeTable({ data, isLoading, pagination, onEdit, onToggle, isToggling }: EmployeeTableProps) {
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Nome",
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
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: { original: Employee } }) => (
        <div className="flex justify-end gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row.original)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(row.original)}
              disabled={isToggling}
            >
              <PowerIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    } as ColumnDef<Employee>,
  ];

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
