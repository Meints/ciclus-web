"use client";

import { PencilIcon, PowerIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
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
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          {row.original.phone && (
            <p className="text-xs text-muted-foreground">{row.original.phone}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
    },
    {
      accessorKey: "servicesThisMonth",
      header: "OS do mês",
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">{row.original.servicesThisMonth ?? 0}</span>
      ),
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
            <Tooltip content="Editar colaborador">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}
          {onToggle && (
            <Tooltip content={row.original.status === "ACTIVE" ? "Desativar colaborador" : "Reativar colaborador"}>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onToggle(row.original); }}
                disabled={isToggling}
              >
                <PowerIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
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
