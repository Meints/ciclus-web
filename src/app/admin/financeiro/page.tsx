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
import { BuildingIcon, DollarSignIcon, FileSignatureIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMRR, useAdminOverview } from "@/hooks/use-admin";
import { formatCurrency } from "@/lib/utils";
import { useIsDark } from "@/hooks/use-is-dark";

export default function AdminFinancePage() {
  const isDark = useIsDark();
  const barColor = isDark ? "#5a9be0" : "#2671c4";
  const tooltipStyle = {
    borderRadius: 8,
    border: "1px solid hsl(var(--border))",
    backgroundColor: "hsl(var(--card))",
    color: "hsl(var(--card-foreground))",
    fontSize: 12,
  };

  const { data: overview, isLoading: overviewLoading } = useAdminOverview();
  const { data: mrr, isLoading: mrrLoading } = useAdminMRR();

  const data = mrr ?? [];
  const latestContracts = data.at(-1)?.activeContracts ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Financeiro"
        description="Receita recorrente e crescimento da base de empresas."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="MRR Global"
          value={formatCurrency(overview?.globalMRR)}
          icon={DollarSignIcon}
          variant="success"
          loading={overviewLoading}
        />
        <KpiCard
          label="Contratos ativos"
          value={latestContracts}
          icon={FileSignatureIcon}
          loading={mrrLoading}
        />
        <KpiCard
          label="Empresas ativas"
          value={overview?.totalCompanies}
          icon={BuildingIcon}
          loading={overviewLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novas empresas por mês</CardTitle>
        </CardHeader>
        <CardContent>
          {mrrLoading ? (
            <div className="h-64 animate-pulse rounded-md bg-muted" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
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
                    formatter={(value) => [value as number, "Novas empresas"]}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="newCompanies" fill={barColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contratos ativos por mês</CardTitle>
        </CardHeader>
        <CardContent>
          {mrrLoading ? (
            <div className="h-64 animate-pulse rounded-md bg-muted" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
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
                    formatter={(value) => [value as number, "Contratos ativos"]}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="activeContracts" fill={barColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
