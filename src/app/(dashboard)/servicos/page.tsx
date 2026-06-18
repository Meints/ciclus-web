"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Columns3Icon,
  ListIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceTable } from "@/components/services/service-table";
import { ServiceKanban } from "@/components/services/service-kanban";
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
  const isTechnician = hasRole(user?.role, ["TECHNICIAN"]);

  const [status, setStatus] = useState<string>(ALL);
  const [employeeId, setEmployeeId] = useState<string>(ALL);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<string>(isTechnician ? "list" : "kanban");

  const { data: employees } = useEmployees({ page: 1, pageSize: 100 });
  const technicians = employees?.data ?? [];

  const { data, isLoading } = useServices({
    page,
    pageSize: view === "kanban" ? 100 : PAGE_SIZE,
    status: status === ALL ? undefined : (status as ServiceStatus),
    employeeId: isAdminOrOwner
      ? employeeId === ALL
        ? undefined
        : employeeId
      : user?.id,
    date: date || undefined,
    search: search || undefined,
  });

  const services = data?.data ?? [];

  function handleRowClick(service: Service) {
    router.push(`/servicos/${service.id}`);
  }

  const filtersNode = (
    <div className="flex flex-wrap gap-3">
      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos</SelectItem>
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
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Técnico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os técnicos</SelectItem>
            {technicians.filter((t) => t.isActive).map((technician) => (
              <SelectItem key={technician.id} value={technician.id}>
                {technician.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Input
        type="date"
        className="w-36"
        value={date}
        onChange={(event) => {
          setDate(event.target.value);
          setPage(1);
        }}
      />

      <Input
        placeholder="Buscar cliente..."
        className="w-48"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isTechnician ? "Minha agenda" : "Serviços"}
        description={
          isTechnician
            ? "Acompanhe seus serviços do dia"
            : "Acompanhe todas as ordens de serviço da empresa"
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

      {filtersNode}

      {!isTechnician && (
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="kanban" className="gap-2">
              <Columns3Icon className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <ListIcon className="h-4 w-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-4">
            <ServiceKanban services={services} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <ServiceTable
              data={services}
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
          </TabsContent>
        </Tabs>
      )}

      {isTechnician && (
        <ServiceTable
          data={services}
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
      )}
    </div>
  );
}
