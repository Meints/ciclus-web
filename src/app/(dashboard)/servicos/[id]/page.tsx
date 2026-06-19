"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  CheckCircle2Icon,
  FileDownIcon,
  Loader2Icon,
  MapPinIcon,
  PlayCircleIcon,
  SendIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { ServiceCompleteDialog } from "@/components/services/service-complete-dialog";
import { ConfirmationLinkPanel } from "@/components/services/confirmation-link-panel";
import { useCancelService, useGenerateServicePdf, useResendConfirmation, useService, useStartService } from "@/hooks/use-services";
import { useAuthStore } from "@/store/auth.store";
import { hasRole } from "@/lib/auth";
import {
  EQUIPMENT_TYPE_LABELS,
  SERVICE_STATUS_LABELS,
  SERVICE_STATUS_VARIANTS,
} from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const canCancel = hasRole(user?.role, ["OWNER", "ADMIN"]);

  const { data: service, isLoading } = useService(id);
  const startService = useStartService(id);
  const cancelService = useCancelService(id);
  const resendConfirmation = useResendConfirmation(id);
  const generatePdf = useGenerateServicePdf(id);

  if (isLoading || !service) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const canStartExecution = service.status === "SCHEDULED";
  const canRegisterExecution = service.status === "IN_PROGRESS";
  const canCancelOrModify = canCancel && service.status !== "CANCELLED" && service.status !== "COMPLETED";

  function handleStartProgress() {
    startService.mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`OS · ${service.customerName}`}
        description={getServiceTypeLabel(service.serviceType)}
        actions={
          <>
            {canStartExecution && (
              <Button
                onClick={handleStartProgress}
                disabled={startService.isPending}
                variant="default"
              >
                {startService.isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PlayCircleIcon />
                )}
                Iniciar execução
              </Button>
            )}
            {canRegisterExecution && (
              <Button onClick={() => setIsCompleteOpen(true)}>
                <CheckCircle2Icon />
                Concluir OS
              </Button>
            )}
            {canCancelOrModify && (
              <Button variant="destructive" onClick={() => setIsCancelOpen(true)}>
                <XCircleIcon />
                Cancelar OS
              </Button>
            )}
            {service.reportPdfUrl && (
              <Button variant="outline" asChild>
                <a href={service.reportPdfUrl} target="_blank" rel="noreferrer">
                  <FileDownIcon />
                  Laudo PDF
                </a>
              </Button>
            )}
            {service.status === "COMPLETED" && !service.reportPdfUrl && (
              <Button
                variant="outline"
                onClick={() => generatePdf.mutate()}
                disabled={generatePdf.isPending}
              >
                {generatePdf.isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <FileDownIcon />
                )}
                Gerar PDF
              </Button>
            )}
          </>
        }
      />

      {/* Info card */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da ordem de serviço</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <Link href={`/clientes/${service.customerId}`} className="font-medium hover:underline">
              {service.customerName}
            </Link>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Endereço</p>
            <p className="flex items-center gap-1 font-medium">
              <MapPinIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
              {service.customerAddress}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <StatusBadge
              label={SERVICE_STATUS_LABELS[service.status]}
              variant={SERVICE_STATUS_VARIANTS[service.status]}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data agendada</p>
            <p className="flex items-center gap-1 font-medium">
              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
              {formatDate(service.scheduledDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Técnico</p>
            <p className="flex items-center gap-1 font-medium">
              <UserIcon className="h-3 w-3 text-muted-foreground" />
              {service.employeeName ?? "Não atribuído"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Contrato</p>
            <Link
              href={`/contratos/${service.contractId}`}
              className="font-medium hover:underline"
            >
              #{service.contractId.slice(0, 7)}
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Equipment card */}
      {(!service.equipmentDetails || service.equipmentDetails.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>
              Equipamentos atendidos
              {service.equipmentDetails && service.equipmentDetails.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({service.equipmentDetails.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!service.equipmentDetails || service.equipmentDetails.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum equipamento informado.</p>
            ) : (
              <div className="divide-y">
                {service.equipmentDetails.map((item) => {
                  const note = service.execution?.equipmentNotes?.find(
                    (entry) => entry.equipmentId === item.id,
                  );
                  return (
                    <div key={item.id} className="flex flex-col gap-1 py-3">
                      <p className="font-medium">{EQUIPMENT_TYPE_LABELS[item.type]}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.brand} {item.model} · {item.location}
                        {item.capacity && ` · ${item.capacity}`}
                      </p>
                      {note?.note && (
                        <p className="mt-1 rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                          <span className="font-medium">Obs do técnico:</span> {note.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Execution card */}
      {service.execution && (
        <Card>
          <CardHeader>
            <CardTitle>Execução registrada</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Concluído em</p>
                <p className="font-medium">{formatDateTime(service.execution.completedAt)}</p>
              </div>
              {service.employeeName && (
                <div>
                  <p className="text-xs text-muted-foreground">Executado por</p>
                  <p className="font-medium">{service.employeeName}</p>
                </div>
              )}
            </div>

            {service.execution.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Observações</p>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm font-medium">
                  {service.execution.notes}
                </p>
              </div>
            )}

            {service.execution.photoUrls.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Fotos ({service.execution.photoUrls.length})
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {service.execution.photoUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block aspect-square overflow-hidden rounded-md border"
                    >
                      <img
                        src={url}
                        alt="Foto da execução"
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation card */}
      {service.execution && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmação do cliente</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {service.confirmationStatus === "CONFIRMED" ? (
                  <StatusBadge
                    label={`Confirmado pelo cliente em ${
                      service.confirmedAt ? formatDateTime(service.confirmedAt) : ""
                    }`}
                    variant="success"
                  />
                ) : (
                  <StatusBadge label="Aguardando confirmação do cliente" variant="warning" />
                )}
              </div>
              {service.confirmationStatus !== "CONFIRMED" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => resendConfirmation.mutate()}
                  disabled={resendConfirmation.isPending}
                >
                  {resendConfirmation.isPending ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <SendIcon />
                  )}
                  Reenviar
                </Button>
              )}
            </div>

            {service.confirmationStatus !== "CONFIRMED" && service.confirmationLink && (
              <ConfirmationLinkPanel
                confirmationLink={service.confirmationLink}
                expiresAt={service.confirmationExpiresAt ?? null}
                customerPhone={service.customerPhone}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <ServiceCompleteDialog
        serviceId={service.id}
        equipment={service.equipmentDetails ?? []}
        customerPhone={service.customerPhone}
        open={isCompleteOpen}
        onOpenChange={setIsCompleteOpen}
      />

      <ConfirmDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        title="Cancelar ordem de serviço"
        description="Esta OS será marcada como cancelada e não poderá ser executada. Esta ação não pode ser desfeita."
        confirmLabel="Cancelar OS"
        destructive
        isLoading={cancelService.isPending}
        onConfirm={() =>
          cancelService.mutate(undefined, { onSuccess: () => setIsCancelOpen(false) })
        }
      />
    </div>
  );
}
