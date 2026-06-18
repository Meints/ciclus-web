"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { EmployeeForm } from "@/components/employees/employee-form";
import { useCreateEmployee } from "@/hooks/use-employees";
import type { EmployeeFormValues } from "@/lib/validations/employee";

export default function NewEmployeePage() {
  const router = useRouter();
  const createEmployee = useCreateEmployee();

  function handleSubmit(values: EmployeeFormValues) {
    createEmployee.mutate(
      { ...values, phone: values.phone || undefined },
      { onSuccess: () => router.push("/equipe") }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Adicionar membro" description="Cadastre um novo colaborador na equipe" />
      <EmployeeForm onSubmit={handleSubmit} isSubmitting={createEmployee.isPending} />
    </div>
  );
}
