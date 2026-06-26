"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  DollarSignIcon,
  FileSignatureIcon,
  Loader2Icon,
  LogInIcon,
  MoreHorizontalIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  Trash2Icon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/shared/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminCompanyDetail,
  useImpersonate,
  useListCompanyUsers,
  useRemoveCompanyUser,
  useToggleCompany,
  useUpdateCompanyPlan,
  useUpdateCompanyUserRole,
} from "@/hooks/use-admin";
import { PLAN_OPTIONS, planBadgeVariant } from "@/lib/admin-plans";
import { ROLE_LABELS } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

export default function AdminCompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [toggleConfirmOpen, setToggleConfirmOpen] = useState(false);
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);

  const { data: company, isLoading } = useAdminCompanyDetail(id);
  const { data: companyUsers } = useListCompanyUsers(id);
  const updatePlan = useUpdateCompanyPlan();
  const impersonate = useImpersonate();
  const toggleCompany = useToggleCompany();
  const removeUser = useRemoveCompanyUser(id);
  const updateUserRole = useUpdateCompanyUserRole(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-muted-foreground">Empresa não encontrada.</p>
        <Button variant="outline" onClick={() => router.push("/admin/empresas")}>
          Voltar para empresas
        </Button>
      </div>
    );
  }

  const chartData = company.monthlyServices.map((m) => ({ month: m.month, OS: m.count }));
  const isActive = (company as any).isActive !== false;

  function handlePlanChange(plan: string) {
    updatePlan.mutate({ id, plan });
  }

  function handleImpersonate() {
    impersonate.mutate(id);
  }

  function handleToggleCompany() {
    toggleCompany.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.isActive ? "Empresa ativada." : "Empresa suspensa.");
        setToggleConfirmOpen(false);
      },
      onError: () => toast.error("Não foi possível alterar o status da empresa."),
    });
  }

  function handleRemoveUser() {
    if (!removeUserId) return;
    removeUser.mutate(removeUserId, {
      onSuccess: () => {
        toast.success("Usuário removido.");
        setRemoveUserId(null);
      },
      onError: (err: Error) => toast.error(err.message || "Não foi possível remover o usuário."),
    });
  }

  function handleRoleChange(userId: string, role: string) {
    updateUserRole.mutate({ userId, role }, {
      onSuccess: () => toast.success("Role atualizado."),
      onError: (err: Error) => toast.error(err.message || "Não foi possível alterar o role."),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/admin/empresas")}
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Empresas
      </button>

      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {company.name}
          </h1>
          <Badge variant={planBadgeVariant(company.plan)}>{company.plan}</Badge>
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Ativa" : "Suspensa"}
          </Badge>
          {company.niche && (
            <span className="text-sm text-muted-foreground">{company.niche}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={company.plan}
            onValueChange={handlePlanChange}
            disabled={updatePlan.isPending}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Editar plano" />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setToggleConfirmOpen(true)}
            disabled={toggleCompany.isPending}
          >
            {toggleCompany.isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : isActive ? (
              <PauseCircleIcon className="h-4 w-4" />
            ) : (
              <PlayCircleIcon className="h-4 w-4" />
            )}
            {isActive ? "Suspender" : "Ativar"}
          </Button>
          <Button onClick={handleImpersonate} disabled={impersonate.isPending || !isActive}>
            {impersonate.isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <LogInIcon className="h-4 w-4" />
            )}
            Entrar como
          </Button>
        </div>
      </div>

      <AlertDialog open={toggleConfirmOpen} onOpenChange={setToggleConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? "Suspender empresa?" : "Ativar empresa?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? "Os usuários desta empresa não conseguirão mais acessar a plataforma."
                : "Os usuários desta empresa voltarão a ter acesso à plataforma."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleCompany}
              className={isActive ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {isActive ? "Suspender" : "Ativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KpiCard label="Clientes" value={company.stats.customers} icon={UsersIcon} />
        <KpiCard
          label="Contratos ativos"
          value={company.stats.activeContracts}
          icon={FileSignatureIcon}
        />
        <KpiCard label="Técnicos" value={company.stats.employees} icon={WrenchIcon} />
        <KpiCard
          label="OS este mês"
          value={company.stats.servicesThisMonth}
          icon={ClipboardListIcon}
        />
        <KpiCard
          label="OS concluídas este mês"
          value={company.stats.completedThisMonth}
          icon={CheckCircle2Icon}
          variant="success"
        />
        <KpiCard
          label="MRR"
          value={formatCurrency(company.stats.mrr)}
          icon={DollarSignIcon}
          variant="success"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>OS por mês (últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Ainda não há serviços registrados.
            </p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={40}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    formatter={(value) => [value as number, "OS"]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="OS" fill="#2671c4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {(companyUsers ?? company.users).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum usuário cadastrado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {(companyUsers ?? company.users).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      {u.role === "OWNER" ? (
                        <span className="text-sm">{ROLE_LABELS[u.role as UserRole] ?? u.role}</span>
                      ) : (
                        <Select
                          value={u.role}
                          onValueChange={(role) => handleRoleChange(u.id, role)}
                        >
                          <SelectTrigger className="h-7 w-36 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                            <SelectItem value="TECHNICIAN">Técnico</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell>
                      {u.role !== "OWNER" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setRemoveUserId(u.id)}
                            >
                              <Trash2Icon className="h-4 w-4" />
                              Remover usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!removeUserId} onOpenChange={(o) => !o && setRemoveUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário perderá acesso à plataforma imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveUser}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
