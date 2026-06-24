"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangleIcon, ImageIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { useRequireAuth, useChangePassword } from "@/hooks/use-auth";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { useUpdateCompanyNiche, useUploadCompanyLogo } from "@/hooks/use-company";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validations/auth";
import { getRoleLabel } from "@/lib/auth";
import { NICHE_LABELS, type ServiceNiche } from "@/lib/service-types";

export default function SettingsPage() {
  const { user } = useRequireAuth(["OWNER"]);
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const changePassword = useChangePassword();
  const updateNiche = useUpdateCompanyNiche();
  const uploadLogo = useUploadCompanyLogo();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  function handleSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => form.reset() }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Configurações" description="Gerencie os dados da sua empresa e conta" />

      {!user?.niche && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-amber-800">
            <AlertTriangleIcon className="h-5 w-5 shrink-0" />
            Antes de continuar, defina o segmento de atuação da sua empresa abaixo. Essa
            configuração define quais tipos de serviço aparecem nas ordens de serviço.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Dados da empresa</CardTitle>
          <CardDescription>Informações da empresa vinculada à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Nome da empresa</p>
            <p className="font-medium">{user?.companyName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seu papel</p>
            <p className="font-medium">{user ? getRoleLabel(user.role) : ""}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Logo da empresa</p>
            <div className="flex items-center gap-4">
              {user?.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt="Logo"
                  className="h-16 w-16 rounded-lg border object-contain"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-muted">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadLogo.mutate(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadLogo.isPending}
                >
                  {uploadLogo.isPending ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <UploadIcon />
                  )}
                  {user?.logoUrl ? "Trocar logo" : "Enviar logo"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG ou WebP
                </p>
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Segmento de atuação
            </p>
            <Select
              value={user?.niche ?? undefined}
              onValueChange={(value) => updateNiche.mutate(value as ServiceNiche)}
            >
              <SelectTrigger className="sm:max-w-xs">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uso atual</CardTitle>
          <CardDescription>Resumo da utilização da plataforma pela sua empresa</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {isSummaryLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Clientes ativos</p>
                <p className="text-xl font-semibold">{summary?.activeCustomers ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contratos ativos</p>
                <p className="text-xl font-semibold">{summary?.activeContracts ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">OS no mês</p>
                <p className="text-xl font-semibold">{summary?.servicesThisMonth ?? 0}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
          <CardDescription>Atualize a senha utilizada para acessar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 sm:max-w-sm"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha atual</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={changePassword.isPending} className="self-start">
                {changePassword.isPending && <Loader2Icon className="animate-spin" />}
                Salvar nova senha
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
