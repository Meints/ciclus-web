"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminCompanies } from "@/hooks/use-admin";
import { PLAN_DETAILS, planBadgeVariant } from "@/lib/admin-plans";

export default function AdminPlansPage() {
  // Fetch a large page to aggregate plan distribution client-side.
  const { data, isLoading } = useAdminCompanies({ pageSize: 1000 });
  const companies = data?.data ?? [];

  const countByPlan = companies.reduce<Record<string, number>>((acc, c) => {
    acc[c.plan] = (acc[c.plan] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Planos"
        description="Limites de cada plano e distribuição das empresas."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLAN_DETAILS.map((plan) => (
          <Card key={plan.key}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <Badge variant={planBadgeVariant(plan.key)}>{plan.key}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Clientes</dt>
                  <dd className="font-medium tabular-nums">{plan.customers}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Contratos</dt>
                  <dd className="font-medium tabular-nums">{plan.contracts}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Técnicos</dt>
                  <dd className="font-medium tabular-nums">{plan.technicians}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">OS / mês</dt>
                  <dd className="font-medium tabular-nums">{plan.services}</dd>
                </div>
              </dl>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">Empresas neste plano</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {isLoading ? "—" : countByPlan[plan.key] ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
