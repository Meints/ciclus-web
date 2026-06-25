"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Columns3Icon,
  FilterIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startOfWeek, endOfWeek } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceTable } from "@/components/services/service-table";
import { ServiceKanban } from "@/components/services/service-kanban";
import { ServiceForm } from "@/components/services/service-form";
import { useServices, useCreateService } from "@/hooks/use-services";
import { useEmployees } from "@/hooks/use-employees";
import { useAuthStore } from "@/store/auth.store";
import { hasRole } from "@/lib/auth";
import { SERVICE_STATUS_LABELS } from "@/lib/labels";
import type { Service, ServiceStatus } from "@/types/service";
import type { ServiceFormValues } from "@/lib/validations/service";

const PAGE_SIZE = 10;
const ALL = "ALL";

export default function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ quickCreate?: string; customerId?: string; contractId?: string }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const handledQuickCreate = useRef(false);
  const user = useAuthStore((state) => state.user);
  const isAdminOrOwner = hasRole(user?.role, ["OWNER", "ADMIN"]);
  const isTechnician = hasRole(user?.role, ["TECHNICIAN"]);

  const [status, setStatus] = useState<string>(ALL);
  const [employeeId, setEmployeeId] = useState<string>(ALL);
  const [searchInput, setSearchInput] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<string>(isTechnician ? "list" : "kanban");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (params.quickCreate === "true" && !handledQuickCreate.current) {
      handledQuickCreate.current = true;
      setShowCreateModal(true);
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [params.quickCreate, router]);

  const { data: employees } = useEmployees({ page: 1, pageSize: 100 });
  const technicians = employees?.data ?? [];

  const dateStart =
    view === "kanban" && !dateFilter
      ? startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().slice(0, 10)
      : dateFilter || undefined;
  const dateEnd =
    view === "kanban" && !dateFilter
      ? endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().slice(0, 10)
      : undefined;

  const { data, isLoading } = useServices({
    page,
    pageSize: view === "kanban" ? 100 : PAGE_SIZE,
    status: status === ALL ? undefined : (status as ServiceStatus),
    employeeId: isAdminOrOwner
      ? employeeId === ALL
        ? undefined
        : employeeId
      : user?.id,
    dateStart,
    dateEnd,
  });
  const createService = useCreateService();

  const allServices = data?.data ?? [];
  const services = searchInput
    ? allServices.filter((s) =>
        s.customerName.toLowerCase().includes(searchInput.toLowerCase())
      )
    : allServices;

  const createDefaultValues = useMemo(() =>
    params.customerId || params.contractId
      ? { customerId: params.customerId, contractId: params.contractId }
      : undefined,
    [params.customerId, params.contractId],
  );

  function handleRowClick(service: Service) {
    router.push(`/servicos/${service.id}`);
  }

  function handleCreate(values: ServiceFormValues) {
    createService.mutate(
      {
        ...values,
        employeeId: values.employeeId || undefined,
      },
      {
        onSuccess: (service) => {
          setShowCreateModal(false);
          router.push(`/servicos/${service.id}`);
        },
      }
    );
  }

  const hasActiveFilters = status !== ALL || employeeId !== ALL || dateFilter || !!searchInput;

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
            <Button onClick={() => setShowCreateModal(true)}>
              <PlusIcon />
              Nova OS
            </Button>
          )
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <FilterIcon className="h-4 w-4 shrink-0 text-muted-foreground" />

        <Select
          value={status}
          onValueChange={(value) => { setStatus(value); setPage(1); }}
        >
          <SelectTrigger className="h-8 w-40 border-0 bg-muted/50 text-sm shadow-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {Object.entries(SERVICE_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isAdminOrOwner && (
          <Select
            value={employeeId}
            onValueChange={(value) => { setEmployeeId(value); setPage(1); }}
          >
            <SelectTrigger className="h-8 w-44 border-0 bg-muted/50 text-sm shadow-none">
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

        <DatePicker
          value={dateFilter}
          onChange={(value) => { setDateFilter(value); setPage(1); }}
          className="h-8 w-52 border-0 bg-muted/50 shadow-none"
        />

        <div className="relative flex items-center">
          <SearchIcon className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            className="h-8 w-44 border-0 bg-muted/50 pl-8 text-sm shadow-none focus-visible:ring-0"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { setStatus(ALL); setEmployeeId(ALL); setDateFilter(""); setSearchInput(""); setPage(1); }}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline cursor-pointer"
          >
            Limpar
          </button>
        )}

        {!isTechnician && (
          <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => setView("kanban")}
              className={`flex cursor-pointer items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                view === "kanban" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns3Icon className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex cursor-pointer items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                view === "list" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListIcon className="h-3.5 w-3.5" />
              Lista
            </button>
          </div>
        )}
      </div>

      {!isTechnician && (
        <>
          {view === "kanban" && <ServiceKanban services={services} isLoading={isLoading} />}
          {view === "list" && (
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
        </>
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

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova ordem de serviço</DialogTitle>
          </DialogHeader>
          <ServiceForm
            defaultValues={createDefaultValues}
            onSubmit={handleCreate}
            isSubmitting={createService.isPending}
            submitLabel="Salvar OS"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
