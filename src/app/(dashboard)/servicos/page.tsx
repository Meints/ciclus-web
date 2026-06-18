"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceTable } from "@/components/services/service-table";
import { useServices } from "@/hooks/use-services";
import { useEmployees } from "@/hooks/use-employees";
import { useAuthStore } from "@/store/auth.store";
import { hasRole } from "@/lib/auth";
import { SERVICE_STATUS_LABELS } from "@/lib/labels";
import type { Service, ServiceStatus } from "@/types/service";

const PAGE_SIZE = 10;
const ALL = "ALL";

export default function ServicesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdminOrOwner = hasRole(user?.role, ["OWNER", "ADMIN"]);

  const [status, setStatus] = useState<string>(ALL);
  const [employeeId, setEmployeeId] = useState<string>(ALL);
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const { data: employees } = useEmployees({ page: 1, pageSize: 100 });
  const technicians = employees?.data.filter((employee) => employee.role === "TECHNICIAN") ?? [];

  const { data, isLoading } = useServices({
    page,
    pageSize: PAGE_SIZE,
    status: status === ALL ? undefined : (status as ServiceStatus),
    employeeId: isAdminOrOwner
      ? employeeId === ALL
        ? undefined
        : employeeId
      : user?.id,
    date: date || undefined,
  });

  function handleRowClick(service: Service) {
    router.push(`/servicos/${service.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Serviços"
        description={
          isAdminOrOwner
            ? "Acompanhe todas as ordens de serviço da empresa"
            : "Acompanhe sua agenda de ordens de serviço"
        }
        actions={
          isAdminOrOwner && (
            <Button onClick={() => router.push("/servicos/novo")}>
              <PlusIcon />
              Nova OS
            </Button>
          )
        }
      />

      <div className="flex flex-wrap gap-3">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os status</SelectItem>
            {Object.entries(SERVICE_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isAdminOrOwner && (
          <Select
            value={employeeId}
            onValueChange={(value) => {
              setEmployeeId(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Técnico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os técnicos</SelectItem>
              {technicians.map((technician) => (
                <SelectItem key={technician.id} value={technician.id}>
                  {technician.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Input
          type="date"
          className="w-40"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <ServiceTable
        data={data?.data ?? []}
        isLoading={isLoading}
        onRowClick={handleRowClick}
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
