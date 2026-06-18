"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerForm } from "@/components/customers/customer-form";
import { useCreateCustomer } from "@/hooks/use-customers";
import type { CustomerFormValues } from "@/lib/validations/customer";

export default function NewCustomerPage() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();

  function handleSubmit(values: CustomerFormValues) {
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
          router.push(`/clientes/${customer.id}`);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Novo cliente" description="Cadastre um novo cliente para sua empresa" />
      <CustomerForm onSubmit={handleSubmit} isSubmitting={createCustomer.isPending} />
    </div>
  );
}
