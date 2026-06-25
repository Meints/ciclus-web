"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, SearchIcon, UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerForm } from "@/components/customers/customer-form";
import { useCustomers, useCreateCustomer } from "@/hooks/use-customers";
import type { Customer } from "@/types/customer";
import type { CustomerFormValues } from "@/lib/validations/customer";

const PAGE_SIZE = 10;

export default function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ quickCreate?: string }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const handledQuickCreate = useRef(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (params.quickCreate === "true" && !handledQuickCreate.current) {
      handledQuickCreate.current = true;
      setShowCreateModal(true);
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [params.quickCreate, router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data, isLoading } = useCustomers({ page, pageSize: PAGE_SIZE, search });
  const createCustomer = useCreateCustomer();

  function handleRowClick(customer: Customer) {
    router.push(`/clientes/${customer.id}`);
  }

  function handleCreate(values: CustomerFormValues) {
    createCustomer.mutate(
      {
        ...values,
        tradeName: values.tradeName || undefined,
        email: values.email || undefined,
        address: {
          ...values.address,
          complement: values.address.complement || undefined,
        },
      },
      {
        onSuccess: (customer) => {
          setShowCreateModal(false);
          router.push(`/clientes/${customer.id}`);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes e seus contratos de serviço"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon />
            Novo cliente
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CNPJ/CPF..."
          className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        {data && (
          <div className="ml-auto flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
            <UsersIcon className="h-3.5 w-3.5" />
            <span>{data.meta.total} cliente{data.meta.total !== 1 ? "s" : ""}</span>
          </div>
        )}
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

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo cliente</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleCreate}
            isSubmitting={createCustomer.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
