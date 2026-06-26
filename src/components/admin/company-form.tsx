"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CopyIcon, CheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useCreateCompany } from "@/hooks/use-admin";
import type { CreateCompanyResult } from "@/types/admin";

const NICHES = [
  { value: "AIR_CONDITIONING", label: "Ar-condicionado" },
  { value: "PEST_CONTROL", label: "Dedetização" },
  { value: "WATER_TANK", label: "Limpeza de caixa d'água" },
  { value: "BUILDING_MAINTENANCE", label: "Manutenção predial" },
  { value: "ELEVATOR", label: "Elevadores" },
  { value: "GENERAL", label: "Geral / Outro" },
];

const PLANS = ["FREE", "STARTER", "PRO", "BUSINESS"];

const schema = z.object({
  companyName: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  ownerName: z.string().min(2, "Nome do responsável deve ter ao menos 2 caracteres"),
  ownerEmail: z.string().email("E-mail inválido"),
  niche: z.string().optional(),
  plan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CredentialsModal({
  result,
  onClose,
}: {
  result: CreateCompanyResult;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = `E-mail: ${result.owner.email}\nSenha temporária: ${result.tempPassword}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Empresa criada com sucesso!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <p className="text-sm text-muted-foreground">
            Anote as credenciais do proprietário antes de fechar. A senha temporária não será
            exibida novamente.
          </p>
          <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm">
            <p>
              <span className="text-muted-foreground">Empresa:</span> {result.company.name}
            </p>
            <p>
              <span className="text-muted-foreground">E-mail:</span> {result.owner.email}
            </p>
            <p>
              <span className="text-muted-foreground">Senha:</span> {result.tempPassword}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
            {copied ? "Copiado!" : "Copiar credenciais"}
          </Button>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CompanyFormDialog({ open, onOpenChange }: CompanyFormDialogProps) {
  const [credentials, setCredentials] = useState<CreateCompanyResult | null>(null);
  const createCompany = useCreateCompany();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormData) {
    createCompany.mutate(data, {
      onSuccess: (result) => {
        toast.success("Empresa criada com sucesso!");
        reset();
        onOpenChange(false);
        setCredentials(result);
      },
      onError: (err: Error) => {
        toast.error(err.message || "Não foi possível criar a empresa.");
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova empresa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="companyName">Nome da empresa</Label>
              <Input id="companyName" {...register("companyName")} placeholder="Empresa Ltda." />
              {errors.companyName && (
                <p className="text-xs text-destructive">{errors.companyName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="niche">Nicho</Label>
                <Select onValueChange={(v) => setValue("niche", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="plan">Plano inicial</Label>
                <Select defaultValue="FREE" onValueChange={(v) => setValue("plan", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-border pt-2">
              <p className="mb-3 text-sm font-medium text-foreground">Proprietário</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ownerName">Nome completo</Label>
                  <Input id="ownerName" {...register("ownerName")} placeholder="João Silva" />
                  {errors.ownerName && (
                    <p className="text-xs text-destructive">{errors.ownerName.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ownerEmail">E-mail</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    {...register("ownerEmail")}
                    placeholder="joao@empresa.com"
                  />
                  {errors.ownerEmail && (
                    <p className="text-xs text-destructive">{errors.ownerEmail.message}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createCompany.isPending}>
                {createCompany.isPending && (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                )}
                Criar empresa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {credentials && (
        <CredentialsModal result={credentials} onClose={() => setCredentials(null)} />
      )}
    </>
  );
}
