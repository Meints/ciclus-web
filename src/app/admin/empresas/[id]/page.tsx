"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
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
  useUpdateCompanyPlan,
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
  const { data: company, isLoading } = useAdminCompanyDetail(id);
  const updatePlan = useUpdateCompanyPlan();
  const impersonate = useImpersonate();

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

  function handlePlanChange(plan: string) {
    updatePlan.mutate({ id, plan });
  }

  function handleImpersonate() {
    impersonate.mutate(id);
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
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {company.name}
          </h1>
          <Badge variant={planBadgeVariant(company.plan)}>{company.plan}</Badge>
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
          <Button onClick={handleImpersonate} disabled={impersonate.isPending}>
            {impersonate.isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <LogInIcon className="h-4 w-4" />
            )}
            Entrar como
          </Button>
        </div>
      </div>

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
          {company.users.length === 0 ? (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {company.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>{ROLE_LABELS[u.role as UserRole] ?? u.role}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
