"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ContractForm } from "@/components/contracts/contract-form";
import { useCreateContract } from "@/hooks/use-contracts";
import type { ContractFormValues } from "@/lib/validations/contract";

export default function NewContractPage() {
  const router = useRouter();
  const createContract = useCreateContract();

  function handleSubmit(values: ContractFormValues) {
    createContract.mutate(
      {
        ...values,
        responsibleEmployeeId: values.responsibleEmployeeId || undefined,
        notes: values.notes || undefined,
      },
      {
        onSuccess: (contract) => {
          router.push(`/contratos/${contract.id}`);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Novo contrato"
        description="A primeira ordem de serviço será agendada automaticamente"
      />
      <ContractForm onSubmit={handleSubmit} isSubmitting={createContract.isPending} />
    </div>
  );
}
