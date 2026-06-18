"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceForm } from "@/components/services/service-form";
import { useCreateService } from "@/hooks/use-services";
import type { ServiceFormValues } from "@/lib/validations/service";

export default function NewServicePage() {
  const router = useRouter();
  const createService = useCreateService();

  function handleSubmit(values: ServiceFormValues) {
    createService.mutate(
      {
        ...values,
        employeeId: values.employeeId || undefined,
      },
      {
        onSuccess: (service) => {
          router.push(`/servicos/${service.id}`);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nova ordem de serviço"
        description="Selecione o cliente, o contrato e os equipamentos que serão atendidos"
      />
      <ServiceForm onSubmit={handleSubmit} isSubmitting={createService.isPending} />
    </div>
  );
}
