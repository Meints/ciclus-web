"use client";

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
  ClipboardCheckIcon,
  ReceiptIcon,
  TagIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { useDashboardSummary, useMonthlyRevenue } from "@/hooks/use-dashboard";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";
import { useIsDark } from "@/hooks/use-is-dark";

export default function ReportsPage() {
  const isDark = useIsDark();
  const barColor = isDark ? "#5a9be0" : "#2671c4";
  const tooltipStyle = {
    borderRadius: 8,
    border: "1px solid hsl(var(--border))",
    backgroundColor: "hsl(var(--card))",
    color: "hsl(var(--card-foreground))",
    fontSize: 12,
  };

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: monthly, isLoading: monthlyLoading } = useMonthlyRevenue();

  const chartData = (monthly ?? []).map((item) => ({
    month: item.month,
    Faturamento: item.value,
    Serviços: item.services,
  }));

  // Derived analytics from the 12-month history
  const totalRevenue12m = (monthly ?? []).reduce((sum, m) => sum + m.value, 0);
  const totalServices12m = (monthly ?? []).reduce((sum, m) => sum + m.services, 0);
  const avgTicket = totalServices12m > 0 ? totalRevenue12m / totalServices12m : null;

  // Current month (last entry)
  const currentMonthServices = (monthly ?? []).at(-1)?.services ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Relatórios"
        description="Visão histórica do faturamento e desempenho operacional."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Faturamento acumulado (12 meses)"
          value={formatCurrency(totalRevenue12m)}
          icon={ReceiptIcon}
          variant="success"
          loading={monthlyLoading}
        />
        <KpiCard
          label="OS concluídas no mês"
          value={summary?.servicesCompletedThisMonth ?? currentMonthServices}
          icon={ClipboardCheckIcon}
          loading={summaryLoading || monthlyLoading}
        />
        <KpiCard
          label="Ticket médio por OS"
          value={avgTicket != null ? formatCurrency(avgTicket) : "—"}
          icon={TagIcon}
          variant="warning"
          loading={monthlyLoading}
        />
        <KpiCard
          label="Contratos vencendo em 30 dias"
          value={summary?.contractsExpiringIn30Days ?? 0}
          icon={TrendingUpIcon}
          variant={summary?.contractsExpiringIn30Days ? "danger" : "default"}
          loading={summaryLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturamento mensal</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyLoading ? (
            <div className="h-72 animate-pulse rounded-md bg-muted" />
          ) : chartData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Ainda não há dados de faturamento.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                    tickFormatter={(v) => formatCompactCurrency(v as number)}
                    width={70}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    formatter={(value) => [formatCurrency(value as number), "Faturamento"]}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="Faturamento" fill={barColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serviços concluídos por mês</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyLoading ? (
            <div className="h-72 animate-pulse rounded-md bg-muted" />
          ) : chartData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Ainda não há dados de serviços.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                    formatter={(value) => [value as number, "Serviços"]}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="Serviços" fill={barColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
