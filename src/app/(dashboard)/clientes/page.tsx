"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/customers/customer-table";
import { useCustomers } from "@/hooks/use-customers";
import type { Customer } from "@/types/customer";

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading } = useCustomers({ page, pageSize: PAGE_SIZE, search });

  function handleRowClick(customer: Customer) {
    router.push(`/clientes/${customer.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes e seus contratos de serviço"
        actions={
          <Button onClick={() => router.push("/clientes/novo")}>
            <PlusIcon />
            Novo cliente
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CNPJ/CPF..."
          className="pl-9"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>

      <CustomerTable
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
