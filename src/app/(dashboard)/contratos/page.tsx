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
import { ContractTable } from "@/components/contracts/contract-table";
import { useContracts } from "@/hooks/use-contracts";
import { CONTRACT_STATUS_LABELS, SERVICE_TYPE_LABELS } from "@/lib/labels";
import type { Contract, ContractStatus, ServiceType } from "@/types/contract";

const PAGE_SIZE = 10;
const ALL = "ALL";

export default function ContractsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>(ALL);
  const [serviceType, setServiceType] = useState<string>(ALL);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useContracts({
    page,
    pageSize: PAGE_SIZE,
    status: status === ALL ? undefined : (status as ContractStatus),
    serviceType: serviceType === ALL ? undefined : (serviceType as ServiceType),
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  function handleRowClick(contract: Contract) {
    router.push(`/contratos/${contract.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Contratos"
        description="Gerencie os contratos de serviço recorrente"
        actions={
          <Button onClick={() => router.push("/contratos/novo")}>
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

        <Select
          value={serviceType}
          onValueChange={(value) => {
            setServiceType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Tipo de serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos os tipos</SelectItem>
            {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          className="w-40"
          value={startDate}
          onChange={(event) => {
            setStartDate(event.target.value);
            setPage(1);
          }}
        />
        <Input
          type="date"
          className="w-40"
          value={endDate}
          onChange={(event) => {
            setEndDate(event.target.value);
            setPage(1);
          }}
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
    </div>
  );
}
