"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useEmployees } from "@/hooks/use-employees";

const PAGE_SIZE = 10;

export default function EmployeesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useEmployees({ page, pageSize: PAGE_SIZE });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Equipe"
        description="Gerencie os colaboradores da sua empresa"
        actions={
          <Button onClick={() => router.push("/equipe/novo")}>
            <PlusIcon />
            Adicionar membro
          </Button>
        }
      />

      <EmployeeTable
        data={data?.data ?? []}
        isLoading={isLoading}
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
    </div>
  );
}
