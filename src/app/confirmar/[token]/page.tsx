"use client";

import { use, useState } from "react";
import { CheckCircle2Icon, Loader2Icon, RecycleIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useConfirmationSummary, useConfirmService } from "@/hooks/use-confirmation";
import { formatDateTime } from "@/lib/utils";

export default function ConfirmServicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF");
  const [consent, setConsent] = useState(false);
  const { data: summary, isLoading } = useConfirmationSummary(token);
  const confirmService = useConfirmService(token);

  function handleConfirm() {
    confirmService.mutate({
      name,
      document: document.replace(/\D/g, "") || undefined,
      documentType,
    });
  }

  const canConfirm = name.trim() && consent;

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
        ) : !summary ? null : summary.status === "not_found" || summary.status === "expired" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <XCircleIcon className="h-10 w-10 text-destructive" />
            <p className="font-medium">
              {summary.status === "expired"
                ? "Este link de confirmação expirou."
                : "Link de confirmação inválido."}
            </p>
            <p className="text-sm text-muted-foreground">
              Solicite ao técnico responsável um novo link de confirmação para esta ordem de
              serviço.
            </p>
          </div>
        ) : summary.status === "confirmed" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2Icon className="h-10 w-10 text-emerald-600" />
            <p className="font-medium">Serviço confirmado com sucesso. Obrigado!</p>
            {summary.confirmedAt && (
              <p className="text-sm text-muted-foreground">
                Confirmado em {formatDateTime(summary.confirmedAt)}
              </p>
            )}
          </div>
        ) : summary.status === "pending" && summary.data ? (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-lg font-semibold">Confirmação de serviço</h1>
              <p className="text-sm text-muted-foreground">
                Confira os dados abaixo e preencha seus dados para confirmar que o serviço foi
                realizado.
              </p>
            </div>

            <dl className="flex flex-col gap-3 rounded-md border bg-muted/30 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Empresa prestadora</dt>
                <dd className="font-medium">{summary.data.companyName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Tipo de serviço</dt>
                <dd className="font-medium">{summary.data.serviceType}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium">{summary.data.customerName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Técnico responsável</dt>
                <dd className="font-medium">{summary.data.technicianName ?? "Não informado"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Data de execução</dt>
                <dd className="font-medium">
                  {summary.data.completedDate ? formatDateTime(summary.data.completedDate) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Número da OS</dt>
                <dd className="font-medium">{summary.data.serviceNumber}</dd>
              </div>
            </dl>

            <div className="space-y-4 rounded-md border p-4">
              <h2 className="text-sm font-semibold">Sua assinatura digital</h2>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">
                  {documentType === "CPF" ? "CPF" : "CNPJ"}
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={documentType}
                    onValueChange={(v) => {
                      setDocumentType(v as "CPF" | "CNPJ");
                      setDocument("");
                    }}
                  >
                    <SelectTrigger className="w-28 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPF">CPF</SelectItem>
                      <SelectItem value="CNPJ">CNPJ</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="document"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="Apenas números"
                    maxLength={documentType === "CPF" ? 11 : 14}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                  Declaro que o serviço foi realizado conforme descrito e confirmo as informações
                  acima.
                </Label>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              className="h-12 text-base"
              disabled={confirmService.isPending || !canConfirm}
              onClick={handleConfirm}
            >
              {confirmService.isPending && <Loader2Icon className="animate-spin" />}
              Confirmo que o serviço foi realizado
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
