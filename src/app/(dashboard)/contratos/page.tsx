"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { ContractTable } from "@/components/contracts/contract-table";
import { ContractForm } from "@/components/contracts/contract-form";
import { useContracts, useCreateContract } from "@/hooks/use-contracts";
import { CONTRACT_STATUS_LABELS } from "@/lib/labels";
import type { Contract, ContractStatus } from "@/types/contract";
import type { ContractFormValues } from "@/lib/validations/contract";

const PAGE_SIZE = 10;
const ALL = "ALL";

export default function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ quickCreate?: string }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const handledQuickCreate = useRef(false);
  const [status, setStatus] = useState<string>(ALL);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (params.quickCreate === "true" && !handledQuickCreate.current) {
      handledQuickCreate.current = true;
      setShowCreateModal(true);
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [params.quickCreate, router]);

  const { data, isLoading } = useContracts({
    page,
    pageSize: PAGE_SIZE,
    status: status === ALL ? undefined : (status as ContractStatus),
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const createContract = useCreateContract();

  function handleRowClick(contract: Contract) {
    router.push(`/contratos/${contract.id}`);
  }

  function handleCreate(values: ContractFormValues) {
    createContract.mutate(
      {
        ...values,
        notes: values.notes || undefined,
      },
      {
        onSuccess: (contract) => {
          setShowCreateModal(false);
          router.push(`/servicos?quickCreate=true&customerId=${contract.customerId}&contractId=${contract.id}`);
        },
      }
    );
  }

  const hasActiveFilters = status !== ALL || startDate || endDate;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contratos"
        description="Gerencie os contratos de serviço recorrente"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon />
            Novo contrato
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <FilterIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-44 border-0 bg-muted/50 text-sm shadow-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os status</SelectItem>
            {Object.entries(CONTRACT_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePicker
          value={startDate}
          onChange={(value) => {
            setStartDate(value);
            setPage(1);
          }}
          placeholder="Data início"
          className="h-8 w-40 border-0 bg-muted/50 shadow-none"
        />
        <DatePicker
          value={endDate}
          onChange={(value) => {
            setEndDate(value);
            setPage(1);
          }}
          placeholder="Data fim"
          className="h-8 w-40 border-0 bg-muted/50 shadow-none"
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { setStatus(ALL); setStartDate(""); setEndDate(""); setPage(1); }}
            className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline cursor-pointer"
          >
            Limpar filtros
          </button>
        )}

        {data && (
          <span className={`${hasActiveFilters ? "" : "ml-auto"} shrink-0 text-xs text-muted-foreground`}>
            {data.meta.total} contrato{data.meta.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <ContractTable
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

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo contrato</DialogTitle>
          </DialogHeader>
          <ContractForm
            onSubmit={handleCreate}
            isSubmitting={createContract.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
