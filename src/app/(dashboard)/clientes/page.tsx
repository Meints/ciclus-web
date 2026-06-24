"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, SearchIcon } from "lucide-react";
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
