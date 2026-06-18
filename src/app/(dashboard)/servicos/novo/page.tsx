"use client";

import { useRouter } from "next/navigation";
import { PlayCircleIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceForm } from "@/components/services/service-form";
import { useCreateService } from "@/hooks/use-services";
import type { ServiceFormValues } from "@/lib/validations/service";

export default function NewServicePage() {
  const router = useRouter();
  const createService = useCreateService();

  function handleSubmit(values: ServiceFormValues, startImmediately?: boolean) {
    createService.mutate(
      {
        ...values,
        employeeId: values.employeeId || undefined,
      },
      {
        onSuccess: (service) => {
          if (startImmediately) {
            router.push(`/servicos/${service.id}?start=true`);
          } else {
            router.push(`/servicos/${service.id}`);
          }
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nova ordem de serviço"
        description="Selecione o cliente, o contrato e os equipamentos que serão atendidos"
        actions={
          <button
            type="submit"
            form="service-form"
            name="action"
            value="create-start"
            className="inline-flex items-center gap-2 rounded-md bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-success-700 transition-colors"
          >
            <PlayCircleIcon className="h-4 w-4" />
            Criar e iniciar
          </button>
        }
      />
      <ServiceForm
        id="service-form"
        onSubmit={(values) => handleSubmit(values, false)}
        isSubmitting={createService.isPending}
        submitLabel="Salvar OS"
        onSubmitAndStart={(values) => handleSubmit(values, true)}
      />
    </div>
  );
}
