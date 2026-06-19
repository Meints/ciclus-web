"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Loader2Icon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { ContractStatusBadge } from "@/components/contracts/contract-status-badge";
import { useCancelContract, useContract } from "@/hooks/use-contracts";
import { useServices } from "@/hooks/use-services";
import {
  CONTRACT_FREQUENCY_LABELS,
  SERVICE_STATUS_LABELS,
  SERVICE_STATUS_VARIANTS,
} from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const { data: contract, isLoading } = useContract(id);
  const cancelContract = useCancelContract(id);
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Contrato · ${contract.customerName}`}
        actions={
          contract.status === "ACTIVE" && (
            <Button variant="destructive" onClick={() => setIsCancelOpen(true)}>
              <XCircleIcon />
              Cancelar contrato
            </Button>
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
            <p className="font-medium">{contract.responsibleEmployeeName ?? "Não definido"}</p>
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
