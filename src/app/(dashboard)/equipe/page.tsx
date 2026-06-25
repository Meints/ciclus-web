"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeForm } from "@/components/employees/employee-form";
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useToggleEmployee,
} from "@/hooks/use-employees";
import type { Employee } from "@/types/employee";
import type { EmployeeFormValues } from "@/lib/validations/employee";

const PAGE_SIZE = 10;

export default function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ quickCreate?: string }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const handledQuickCreate = useRef(false);
  const [page, setPage] = useState(1);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (params.quickCreate === "true" && !handledQuickCreate.current) {
      handledQuickCreate.current = true;
      setShowCreateModal(true);
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [params.quickCreate, router]);

  const { data, isLoading } = useEmployees({ page, pageSize: PAGE_SIZE });
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee(editingEmployee?.id ?? "");
  const toggleEmployee = useToggleEmployee();

  function handleEdit(employee: Employee) {
    setEditingEmployee(employee);
  }

  function handleCreate(values: EmployeeFormValues) {
    createEmployee.mutate(
      { ...values, phone: values.phone || undefined },
      { onSuccess: () => setShowCreateModal(false) },
    );
  }

  function handleUpdate(values: EmployeeFormValues) {
    if (!editingEmployee) return;
    updateEmployee.mutate(
      { ...values, phone: values.phone || undefined },
      { onSuccess: () => setEditingEmployee(null) },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Equipe"
        description="Gerencie os colaboradores da sua empresa"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon />
            Adicionar membro
          </Button>
        }
      />

      {/* Summary bar */}
      {data && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{data.meta.total}</span> colaborador{data.meta.total !== 1 ? "es" : ""} cadastrado{data.meta.total !== 1 ? "s" : ""}
          </span>
          <span className="ml-auto text-xs text-success-600 font-medium">
            {data.data.filter((e) => e.status === "ACTIVE").length} ativos
          </span>
        </div>
      )}

      <EmployeeTable
        data={data?.data ?? []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onToggle={(employee) => toggleEmployee.mutate(employee.id)}
        isToggling={toggleEmployee.isPending}
        pagination={
          data
            ? {
                page: data.meta.page,
                pageSize: data.meta.pageSize,
                total: data.meta.total,
                totalPages: data.meta.totalPages,
                onPageChange: setPage,
              }
            : undefined
        }
      />

      <Dialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar membro</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            onSubmit={handleCreate}
            isSubmitting={createEmployee.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingEmployee}
        onOpenChange={(open) => { if (!open) setEditingEmployee(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar membro</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            defaultValues={{
              name: editingEmployee?.name ?? "",
              email: editingEmployee?.email ?? "",
              phone: editingEmployee?.phone ?? "",
            }}
            onSubmit={handleUpdate}
            isSubmitting={updateEmployee.isPending}
            submitLabel="Salvar"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
