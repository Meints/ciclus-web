"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
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

      <div className="flex flex-wrap gap-3">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
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
          className="w-40"
        />
        <DatePicker
          value={endDate}
          onChange={(value) => {
            setEndDate(value);
            setPage(1);
          }}
          placeholder="Data fim"
          className="w-40"
        />
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
