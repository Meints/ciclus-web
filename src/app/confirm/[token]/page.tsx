"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, WrenchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import { getServiceTypeLabel } from "@/lib/service-types";

type PageState =
  | { status: "loading" }
  | { status: "pending"; data: ConfirmationData }
  | { status: "confirmed"; confirmedAt: string }
  | { status: "expired" }
  | { status: "not_found" }
  | { status: "error"; message: string };

interface ConfirmationData {
  serviceNumber: number;
  serviceType: string | null;
  scheduledAt: string;
  completedDate: string;
  technicianName: string | null;
  companyName: string;
  customerName: string;
  equipment: Array<{ type: string; brand: string; model: string; location: string }>;
}

export default function ConfirmPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [pageState, setPageState] = useState<PageState>({ status: "loading" });
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api
      .get(`/confirm/${token}`)
      .then((res) => {
        const body = res.data;
        const data = body?.data ?? body;
        if (data.alreadyConfirmed) {
          setPageState({ status: "confirmed", confirmedAt: data.confirmedAt });
        } else if (data.serviceNumber) {
          setPageState({ status: "pending", data: data as ConfirmationData });
        } else {
          setPageState({ status: "not_found" });
        }
      })
      .catch((err) => {
        const errorCode = err.response?.data?.error;
        if (errorCode === "EXPIRED") {
          setPageState({ status: "expired" });
        } else if (err.response?.status === 404 || errorCode === "NOT_FOUND") {
          setPageState({ status: "not_found" });
        } else {
          setPageState({ status: "error", message: err.response?.data?.message ?? "Erro ao carregar" });
        }
      });
  }, [token]);

  function handleConfirm() {
    setConfirming(true);
    api
      .post(`/confirm/${token}`)
      .then((res) => {
        const body = res.data;
        setPageState({ status: "confirmed", confirmedAt: body.confirmedAt ?? new Date().toISOString() });
      })
      .catch((err) => {
        setConfirming(false);
        const errorCode = err.response?.data?.error;
        if (errorCode === "ALREADY_CONFIRMED") {
          setPageState({ status: "confirmed", confirmedAt: err.response?.data?.confirmedAt ?? new Date().toISOString() });
        } else if (errorCode === "EXPIRED") {
          setPageState({ status: "expired" });
        } else {
          alert(err.response?.data?.message ?? "Erro ao confirmar");
        }
      });
  }

  if (pageState.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (pageState.status === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Link expirado</CardTitle>
          </CardHeader>
          <CardContent>
            <ClockIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p>Este link de confirmação expirou. Solicite um novo link à empresa.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState.status === "not_found") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Link inválido</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Este link de confirmação não é válido. Verifique o link ou solicite um novo.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{pageState.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageState.status === "confirmed") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-green-600">Serviço confirmado!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CheckCircle2Icon className="h-16 w-16 text-green-600" />
            <p>Sua ordem de serviço foi confirmada com sucesso.</p>
            <p className="text-sm text-muted-foreground">
              Confirmado em {formatDateTime(pageState.confirmedAt)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const data = pageState.data;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mb-2 text-sm font-medium text-muted-foreground">{data.companyName}</div>
          <CardTitle>Confirmação de serviço</CardTitle>
          <p className="text-sm text-muted-foreground">
            OS #{data.serviceNumber} &middot; {formatDate(data.scheduledAt)}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente</p>
                <p className="font-medium">{data.customerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Técnico</p>
                <p className="font-medium">{data.technicianName ?? "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo de serviço</p>
                <p className="font-medium">
                  {data.serviceType ? getServiceTypeLabel(data.serviceType) : "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Realizado em</p>
                <p className="font-medium">{formatDateTime(data.completedDate)}</p>
              </div>
            </div>

            {data.equipment.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Equipamentos</p>
                <div className="flex flex-col gap-2">
                  {data.equipment.map((eq, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <WrenchIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span>
                        {eq.brand} {eq.model} &middot; {eq.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Confirme abaixo que o serviço foi realizado conforme o esperado.
          </p>

          <Button
            onClick={handleConfirm}
            disabled={confirming}
            size="lg"
            className="w-full"
          >
            {confirming ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <CheckCircle2Icon />
            )}
            {confirming ? "Confirmando..." : "Confirmar serviço"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
