"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertTriangleIcon,
  ClipboardListIcon,
  ImageIcon,
  KeyRoundIcon,
  Loader2Icon,
  LockIcon,
  UploadIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  function handleSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          form.reset();
          setShowPasswordForm(false);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Configurações"
        description="Gerencie os dados da sua empresa e conta"
      />

      {!user?.niche && (
        <div className="flex items-start gap-3 rounded-lg border border-warning-400/40 bg-warning-50 p-4 text-sm text-warning-600">
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Defina o <strong>segmento de atuação</strong> da sua empresa para que os tipos de
            serviço apareçam corretamente nas ordens de serviço.
          </p>
        </div>
      )}

      <Tabs defaultValue="empresa">
        <TabsList>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="uso">Plano e uso</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        {/* ── Empresa ── */}
        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <CardTitle>Dados da empresa</CardTitle>
              <CardDescription>Informações da empresa vinculada à sua conta</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                {user?.logoUrl ? (
                  <img
                    src={user.logoUrl}
                    alt="Logo da empresa"
                    className="h-16 w-16 rounded-xl border object-contain"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border bg-muted">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-medium">{user?.companyName ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG ou WebP · até 5 MB</p>
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
                    className="self-start"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadLogo.isPending}
                  >
                    {uploadLogo.isPending ? (
                      <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UploadIcon className="h-3.5 w-3.5" />
                    )}
                    {user?.logoUrl ? "Trocar logo" : "Enviar logo"}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Nome da empresa</p>
                  <p className="text-sm font-medium">{user?.companyName ?? "—"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Seu papel</p>
                  <Badge variant="secondary" className="w-fit">
                    {user ? getRoleLabel(user.role) : "—"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Segmento de atuação</p>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Plano e uso ── */}
        <TabsContent value="uso">
          <Card>
            <CardHeader>
              <CardTitle>Plano e uso</CardTitle>
              <CardDescription>Resumo da utilização da plataforma pela sua empresa</CardDescription>
            </CardHeader>
            <CardContent>
              {isSummaryLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Carregando...
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { icon: UsersIcon, label: "Clientes ativos", value: summary?.activeCustomers ?? 0 },
                    { icon: ClipboardListIcon, label: "Contratos ativos", value: summary?.activeContracts ?? 0 },
                    { icon: UserCheckIcon, label: "OS no mês", value: summary?.servicesThisMonth ?? 0 },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-xl font-semibold">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Segurança ── */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Atualize a senha utilizada para acessar a plataforma</CardDescription>
                </div>
                {!showPasswordForm && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    <KeyRoundIcon className="h-3.5 w-3.5" />
                    Alterar senha
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {!showPasswordForm ? (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <LockIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Senha configurada</p>
                    <p className="text-xs text-muted-foreground">
                      Clique em "Alterar senha" para redefinir suas credenciais de acesso.
                    </p>
                  </div>
                </div>
              ) : (
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
                    <div className="flex gap-2">
                      <Button type="submit" disabled={changePassword.isPending}>
                        {changePassword.isPending && (
                          <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Salvar nova senha
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          form.reset();
                          setShowPasswordForm(false);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
