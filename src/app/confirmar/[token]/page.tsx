"use client";

import { use } from "react";
import { CheckCircle2Icon, Loader2Icon, RecycleIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirmationSummary, useConfirmService } from "@/hooks/use-confirmation";
import { formatDateTime } from "@/lib/utils";

export default function ConfirmServicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { data: summary, isLoading } = useConfirmationSummary(token);
  const confirmService = useConfirmService(token);

  return (
    <div className="flex min-h-screen flex-col items-center bg-muted/30 px-4 py-10">
      <div className="flex items-center gap-2 pb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <RecycleIcon className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold">Ciclus</span>
      </div>

      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !summary || summary.status === "NOT_FOUND" || summary.status === "EXPIRED" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <XCircleIcon className="h-10 w-10 text-destructive" />
            <p className="font-medium">
              {summary?.status === "EXPIRED"
                ? "Este link de confirmação expirou."
                : "Link de confirmação inválido."}
            </p>
            <p className="text-sm text-muted-foreground">
              Solicite ao técnico responsável um novo link de confirmação para esta ordem de
              serviço.
            </p>
          </div>
        ) : summary.status === "CONFIRMED" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2Icon className="h-10 w-10 text-emerald-600" />
            <p className="font-medium">Serviço confirmado com sucesso. Obrigado!</p>
            {summary.confirmedAt && (
              <p className="text-sm text-muted-foreground">
                Confirmado em {formatDateTime(summary.confirmedAt)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-lg font-semibold">Confirmação de serviço</h1>
              <p className="text-sm text-muted-foreground">
                Confira os dados abaixo e confirme que o serviço foi realizado.
              </p>
            </div>

            <dl className="flex flex-col gap-3 rounded-md border bg-muted/30 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Empresa prestadora</dt>
                <dd className="font-medium">{summary.companyName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Tipo de serviço</dt>
                <dd className="font-medium">{summary.serviceTypeLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium">{summary.customerName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Técnico responsável</dt>
                <dd className="font-medium">{summary.technicianName ?? "Não informado"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Data de execução</dt>
                <dd className="font-medium">
                  {summary.completedAt ? formatDateTime(summary.completedAt) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Número da OS</dt>
                <dd className="font-medium">{summary.serviceId}</dd>
              </div>
            </dl>

            <Button
              type="button"
              size="lg"
              className="h-12 text-base"
              disabled={confirmService.isPending}
              onClick={() => confirmService.mutate()}
            >
              {confirmService.isPending && <Loader2Icon className="animate-spin" />}
              Confirmo que o serviço foi realizado
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
