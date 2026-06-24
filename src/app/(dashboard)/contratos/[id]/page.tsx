"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Loader2Icon, PencilIcon, XCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { ContractForm } from "@/components/contracts/contract-form";
import { useCancelContract, useContract, useUpdateContract } from "@/hooks/use-contracts";
import { useServices } from "@/hooks/use-services";
import {
  CONTRACT_FREQUENCY_LABELS,
  SERVICE_STATUS_LABELS,
  SERVICE_STATUS_VARIANTS,
} from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ContractFormValues } from "@/lib/validations/contract";

function toDateInput(dateStr: string): string {
  return dateStr.slice(0, 10);
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: contract, isLoading } = useContract(id);
  const cancelContract = useCancelContract(id);
  const updateContract = useUpdateContract(id);
  const { data: services, isLoading: isServicesLoading } = useServices({
    contractId: id,
    page: 1,
    pageSize: 50,
  });

  if (isLoading || !contract) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  function handleEdit(values: ContractFormValues) {
    updateContract.mutate(
      {
        customerId: values.customerId,
        frequency: values.frequency,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        value: values.value,
        notes: values.notes,
      },
      { onSuccess: () => setIsEditOpen(false) },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Contrato · ${contract.customerName}`}
        actions={
          contract.status === "ACTIVE" && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                <PencilIcon />
                Editar
              </Button>
              <Button variant="destructive" onClick={() => setIsCancelOpen(true)}>
                <XCircleIcon />
                Cancelar contrato
              </Button>
            </div>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Dados do contrato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <Link href={`/clientes/${contract.customerId}`} className="font-medium hover:underline">
              {contract.customerName}
            </Link>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Periodicidade</p>
            <p className="font-medium">{CONTRACT_FREQUENCY_LABELS[contract.frequency]}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <ContractStatusBadge status={contract.status} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Início</p>
            <p className="font-medium">{formatDate(contract.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Próxima visita</p>
            <p className="font-medium">
              {contract.nextVisitDate ? formatDate(contract.nextVisitDate) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor</p>
            <p className="font-medium">{formatCurrency(contract.value)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Técnico responsável</p>
              <p className="font-medium">Definido na OS</p>
          </div>
          {contract.notes && (
            <div className="sm:col-span-3">
              <p className="text-xs text-muted-foreground">Observações</p>
              <p className="font-medium">{contract.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ordens de serviço geradas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isServicesLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : !services || services.data.length === 0 ? (
            <EmptyState
              title="Nenhuma OS gerada"
              description="As ordens de serviço aparecem aqui conforme são agendadas."
            />
          ) : (
            <div className="divide-y">
              {services.data.map((service) => (
                <Link
                  key={service.id}
                  href={`/servicos/${service.id}`}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-accent/40"
                >
                  <div>
                    <p className="font-medium">{formatDate(service.scheduledDate)}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.employeeName ?? "Sem técnico"}
                    </p>
                  </div>
                  <StatusBadge
                    label={SERVICE_STATUS_LABELS[service.status]}
                    variant={SERVICE_STATUS_VARIANTS[service.status]}
                  />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar contrato</DialogTitle>
          </DialogHeader>
          <ContractForm
            defaultValues={{
              customerId: contract.customerId,
              frequency: contract.frequency,
              startDate: toDateInput(contract.startDate),
              endDate: toDateInput(contract.endDate),
              value: contract.value,
              notes: contract.notes ?? "",
            }}
            onSubmit={handleEdit}
            isSubmitting={updateContract.isPending}
            submitLabel="Salvar alterações"
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        title="Cancelar contrato"
        description="As próximas ordens de serviço deste contrato não serão mais geradas. Esta ação não pode ser desfeita."
        confirmLabel="Cancelar contrato"
        destructive
        isLoading={cancelContract.isPending}
        onConfirm={() => cancelContract.mutate(undefined, { onSuccess: () => setIsCancelOpen(false) })}
      />
    </div>
  );
}
