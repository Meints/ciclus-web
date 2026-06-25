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
import { SignaturePad } from "@/components/shared/signature-pad";
import { useConfirmationSummary, useConfirmService } from "@/hooks/use-confirmation";
import { formatDateTime } from "@/lib/utils";

export default function ConfirmServicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const { data: summary, isLoading } = useConfirmationSummary(token);
  const confirmService = useConfirmService(token);

  function handleConfirm() {
    confirmService.mutate({
      name,
      document: document.replace(/\D/g, "") || undefined,
      documentType,
      signatureDataUrl: signatureDataUrl ?? undefined,
    });
  }

  const canConfirm = name.trim() && consent;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-brand-50 to-gray-50 px-4 py-10 dark:from-background dark:to-background">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <RecycleIcon className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Ciclus</span>
      </div>

      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !summary ? null : summary.status === "not_found" || summary.status === "expired" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <XCircleIcon className="h-10 w-10 text-destructive" />
            <p className="font-semibold">
              {summary.status === "expired"
                ? "Este link de confirmação expirou."
                : "Link de confirmação inválido."}
            </p>
            <p className="text-sm text-muted-foreground">
              Solicite ao técnico responsável um novo link de confirmação para esta ordem de serviço.
            </p>
          </div>
        ) : summary.status === "confirmed" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2Icon className="h-12 w-12 text-success-500" />
            <p className="text-lg font-semibold">Serviço confirmado!</p>
            <p className="text-sm text-muted-foreground">
              Obrigado por confirmar o serviço realizado.
            </p>
            {summary.confirmedAt && (
              <p className="text-xs text-muted-foreground">
                Confirmado em {formatDateTime(summary.confirmedAt)}
              </p>
            )}
          </div>
        ) : summary.status === "pending" && summary.data ? (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-lg font-semibold">Confirmação de serviço</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Confirme que o serviço foi realizado corretamente preenchendo seus dados abaixo.
              </p>
            </div>

            {/* Service summary */}
            <dl className="flex flex-col gap-2.5 rounded-lg border border-border bg-muted/40 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Empresa</dt>
                <dd className="font-medium text-right">{summary.data.companyName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Tipo de serviço</dt>
                <dd className="font-medium text-right">{summary.data.serviceType}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium text-right">{summary.data.customerName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Técnico responsável</dt>
                <dd className="font-medium text-right">{summary.data.technicianName ?? "Não informado"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Data de execução</dt>
                <dd className="font-medium text-right">
                  {summary.data.completedDate ? formatDateTime(summary.data.completedDate) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Nº da OS</dt>
                <dd className="font-mono font-medium text-right">#{summary.data.serviceNumber}</dd>
              </div>
            </dl>

            {/* Digital signature form */}
            <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold">Sua assinatura digital</h2>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="document">{documentType === "CPF" ? "CPF" : "CNPJ"}</Label>
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

              {/* Signature canvas */}
              <div className="flex flex-col gap-1.5">
                <Label>Assinatura</Label>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <SignaturePad
                    value={signatureDataUrl}
                    onChange={setSignatureDataUrl}
                    height={120}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Assine com o dedo ou mouse na área acima (opcional)
                </p>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                  Declaro que o serviço foi realizado conforme descrito e confirmo as informações acima.
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

            <p className="text-center text-[11px] text-muted-foreground">
              Sua confirmação tem validade jurídica conforme MP 2.200-2/2001 e Lei 14.063/2020.
              O IP de origem e data/hora serão registrados automaticamente.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
