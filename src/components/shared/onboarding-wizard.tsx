"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckCircle2Icon, Loader2Icon, PartyPopperIcon, RecycleIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { useAuthStore } from "@/store/auth.store";
import { useUpdateCompanyNiche } from "@/hooks/use-company";
import { useCreateCustomer } from "@/hooks/use-customers";
import { NICHE_LABELS, type ServiceNiche } from "@/lib/service-types";
import type { CustomerDocumentType } from "@/types/customer";

export function OnboardingWizard() {
  const user = useAuthStore((state) => state.user);

  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState<ServiceNiche | "">("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [documentType, setDocumentType] = useState<CustomerDocumentType>("CNPJ");
  const [document, setDocument] = useState("");

  const updateNiche = useUpdateCompanyNiche();
  const createCustomer = useCreateCustomer();

  // Lock the visibility decision once, so updating the niche mid-flow
  // (which clears the "no niche" condition) does not unmount the wizard.
  const [active, setActive] = useState<boolean | null>(null);
  if (active === null && user) {
    setActive(user.role === "OWNER" && !user.niche);
  }

  if (!active) return null;

  function handleNicheNext() {
    if (!niche) return;
    updateNiche.mutate(niche as ServiceNiche, {
      onSuccess: () => setStep(2),
    });
  }

  function handleCustomerNext() {
    if (customerName.trim().length < 2 || document.trim().length < 11) return;
    createCustomer.mutate(
      {
        legalName: customerName.trim(),
        documentType,
        document: document.trim(),
        phone: customerPhone.trim(),
        address: {
          zipCode: "",
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
        },
      },
      { onSuccess: () => setStep(3) },
    );
  }

  return (
    <Dialog open>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-md [&>button[aria-label='Close']]:hidden [&>button:last-child]:hidden"
      >
        <DialogTitle className="sr-only">Configuração inicial</DialogTitle>
        <div className="mb-2 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1.5 flex-1 rounded-full ${
                n <= step ? "bg-brand-500" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <RecycleIcon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold">Bem-vindo(a) ao Ciclus!</h2>
              <p className="text-sm text-muted-foreground">
                Vamos configurar sua conta. Comece escolhendo o segmento de atuação
                da sua empresa.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Segmento de atuação</Label>
              <Select value={niche} onValueChange={(v) => setNiche(v as ServiceNiche)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NICHE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleNicheNext}
              disabled={!niche || updateNiche.isPending}
              className="w-full"
            >
              {updateNiche.isPending ? <Loader2Icon className="animate-spin" /> : <ArrowRightIcon />}
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-center">
              <h2 className="text-lg font-semibold">Adicione seu primeiro cliente</h2>
              <p className="text-sm text-muted-foreground">
                Cadastre um cliente para começar a gerenciar contratos e serviços.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="onboarding-name">Nome do cliente</Label>
              <Input
                id="onboarding-name"
                placeholder="Ex: Condomínio Edifício Central"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1.5">
                <Label>Tipo</Label>
                <Select
                  value={documentType}
                  onValueChange={(v) => setDocumentType(v as CustomerDocumentType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                    <SelectItem value="CPF">CPF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="onboarding-doc">
                  {documentType === "CNPJ" ? "CNPJ" : "CPF"}
                </Label>
                <Input
                  id="onboarding-doc"
                  placeholder={documentType === "CNPJ" ? "00.000.000/0000-00" : "000.000.000-00"}
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="onboarding-phone">Telefone</Label>
              <Input
                id="onboarding-phone"
                placeholder="(11) 99999-9999"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                Pular
              </Button>
              <Button
                onClick={handleCustomerNext}
                disabled={
                  customerName.trim().length < 2 ||
                  document.trim().length < 11 ||
                  createCustomer.isPending
                }
                className="flex-1"
              >
                {createCustomer.isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <ArrowRightIcon />
                )}
                Salvar cliente
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-600">
              <PartyPopperIcon className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Tudo configurado!</h2>
              <p className="text-sm text-muted-foreground">
                Comece criando contratos e agendando serviços para seus clientes.
              </p>
            </div>
            <Button onClick={() => window.location.assign("/")} className="w-full">
              <CheckCircle2Icon />
              Ir para o Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
