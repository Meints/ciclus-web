"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  FileTextIcon,
  FilterXIcon,
  ImageIcon,
  KeyRoundIcon,
  Loader2Icon,
  LockIcon,
  PenLineIcon,
  ShieldIcon,
  UploadIcon,
  UserCheckIcon,
  UserPlusIcon,
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
import { useAuditLog, useCompanyUsers, useDashboardSummary } from "@/hooks/use-dashboard";
import type { AuditFilters } from "@/hooks/use-dashboard";
import type { RecentActivity } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { useUploadCompanyLogo } from "@/hooks/use-company";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validations/auth";
import { getRoleLabel } from "@/lib/auth";
import { NICHE_LABELS, type ServiceNiche } from "@/lib/service-types";


function getActivityIcon(entityType: string, action: string) {
  if (action?.includes("CONFIRM") || action?.includes("SIGN")) return PenLineIcon;
  if (entityType === "Service" && action?.includes("COMPLETE")) return CheckCircle2Icon;
  if (entityType === "Contract") return FileTextIcon;
  if (entityType === "Customer") return UserPlusIcon;
  if (entityType === "Service") return ClipboardListIcon;
  if (entityType === "Company") return ShieldIcon;
  return CalendarIcon;
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "ontem";
  return `há ${days} dias`;
}

function AuditRow({ activity }: { activity: RecentActivity }) {
  const Icon = getActivityIcon(activity.entityType, activity.action);
  const iconColor =
    activity.action?.includes("CONFIRM")
      ? "bg-success-50 text-success-600"
      : activity.entityType === "Service"
        ? "bg-brand-50 text-brand-600"
        : activity.entityType === "Contract"
          ? "bg-warning-50 text-warning-600"
          : "bg-muted text-muted-foreground";

  return (
    <div className="flex items-start gap-3 px-5 py-3">
      <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", iconColor)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{activity.description}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {activity.userName && <span className="font-medium text-foreground">{activity.userName} · </span>}
          {formatRelativeTime(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}

const ACTION_OPTIONS = [
  { value: "CREATE", label: "Criação" },
  { value: "UPDATE", label: "Atualização" },
  { value: "DELETE", label: "Exclusão" },
  { value: "START", label: "Início de OS" },
  { value: "COMPLETE", label: "Conclusão de OS" },
  { value: "CONFIRM", label: "Confirmação" },
  { value: "CANCEL", label: "Cancelamento" },
  { value: "RESCHEDULE", label: "Reagendamento" },
  { value: "REOPEN", label: "Reabertura" },
  { value: "REVERT", label: "Reversão" },
  { value: "TOGGLE_PAID", label: "Pagamento" },
  { value: "PAUSE", label: "Pausar contrato" },
  { value: "RESUME", label: "Retomar contrato" },
  { value: "ACTIVATE", label: "Ativação" },
  { value: "DEACTIVATE", label: "Desativação" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "CHANGE_PASSWORD", label: "Troca de senha" },
  { value: "UPLOAD_LOGO", label: "Upload de logo" },
];

const ENTITY_OPTIONS = [
  { value: "Service", label: "OS" },
  { value: "Customer", label: "Cliente" },
  { value: "Contract", label: "Contrato" },
  { value: "Employee", label: "Funcionário" },
  { value: "Equipment", label: "Equipamento" },
  { value: "Company", label: "Empresa" },
  { value: "User", label: "Usuário" },
];

function AuditTab() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuditFilters>({});
  const { data, isLoading } = useAuditLog(page, 25, filters);
  const { data: users } = useCompanyUsers();

  const hasFilters = Object.values(filters).some(Boolean);

  function applyFilter(key: keyof AuditFilters, value: string) {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  }

  function clearFilters() {
    setPage(1);
    setFilters({});
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auditoria</CardTitle>
        <CardDescription>Histórico de todas as ações realizadas na plataforma</CardDescription>
      </CardHeader>

      {/* Filters */}
      <div className="border-b px-5 pb-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* User */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Usuário</label>
            <Select value={filters.userId ?? ""} onValueChange={(v) => applyFilter("userId", v)}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {users?.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ação */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Ação</label>
            <Select value={filters.action ?? ""} onValueChange={(v) => applyFilter("action", v)}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {ACTION_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Entidade */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Entidade</label>
            <Select value={filters.entityType ?? ""} onValueChange={(v) => applyFilter("entityType", v)}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {ENTITY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data de */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">De</label>
            <DatePicker
              value={filters.dateFrom}
              onChange={(v) => applyFilter("dateFrom", v)}
              placeholder="Data inicial"
              className="h-8 w-40 text-xs"
            />
          </div>

          {/* Data até */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Até</label>
            <DatePicker
              value={filters.dateTo}
              onChange={(v) => applyFilter("dateTo", v)}
              placeholder="Data final"
              className="h-8 w-40 text-xs"
            />
          </div>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 gap-1.5 text-xs text-muted-foreground">
              <FilterXIcon className="h-3.5 w-3.5" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <div className="mt-0.5 h-7 w-7 animate-pulse rounded-full bg-muted" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <ShieldIcon className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {hasFilters ? "Nenhum registro encontrado com esses filtros." : "Nenhuma atividade registrada ainda."}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {data.data.map((activity) => (
                <AuditRow key={activity.id} activity={activity} />
              ))}
            </div>
            <div className="flex items-center justify-between border-t px-5 py-3">
              <p className="text-xs text-muted-foreground">
                {data.meta.total === 0
                  ? "Nenhum registro"
                  : `${(page - 1) * 25 + 1}–${Math.min(page * 25, data.meta.total)} de ${data.meta.total} registros`}
              </p>
              {data.meta.totalPages > 1 && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Anterior
                  </Button>
                  <Button variant="ghost" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { user } = useRequireAuth(["OWNER"]);
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const changePassword = useChangePassword();
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


      <Tabs defaultValue="empresa">
        <TabsList>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="uso">Plano e uso</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
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
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Segmento de atuação</p>
                  {user?.niche ? (
                    <Badge variant="secondary" className="w-fit text-sm">
                      {NICHE_LABELS[user.niche as ServiceNiche]}
                    </Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground">Não configurado</p>
                  )}
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
                      Clique em &quot;Alterar senha&quot; para redefinir suas credenciais de acesso.
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
        {/* ── Auditoria ── */}
        <TabsContent value="auditoria">
          <AuditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
