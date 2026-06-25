"use client";

import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  DollarSignIcon,
  FileTextIcon,
  TrendingUpIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminOverview, useAdminCompanies } from "@/hooks/use-admin";
import { planBadgeVariant } from "@/lib/admin-plans";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminOverviewPage() {
  const router = useRouter();
  const { data: overview, isLoading } = useAdminOverview();
  const { data: companiesResp, isLoading: companiesLoading } = useAdminCompanies({
    pageSize: 5,
  });

  const companies = companiesResp?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Visão geral"
        description="Panorama da plataforma Ciclus e das empresas cadastradas."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Empresas ativas"
          value={overview?.totalCompanies}
          icon={FileTextIcon}
          loading={isLoading}
        />
        <KpiCard
          label="Novas este mês"
          value={overview?.newThisMonth}
          icon={TrendingUpIcon}
          variant="success"
          loading={isLoading}
        />
        <KpiCard
          label="MRR Global"
          value={formatCurrency(overview?.globalMRR)}
          icon={DollarSignIcon}
          variant="success"
          loading={isLoading}
        />
        <KpiCard
          label="Em risco"
          value={overview?.atRiskCount}
          icon={AlertCircleIcon}
          variant={overview && overview.atRiskCount > 0 ? "danger" : "default"}
          loading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empresas recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {companiesLoading ? (
            <div className="h-40 animate-pulse rounded-md bg-muted" />
          ) : companies.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma empresa cadastrada.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nicho</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead className="text-right">Clientes</TableHead>
                  <TableHead className="text-right">OS este mês</TableHead>
                  <TableHead>Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/empresas/${c.id}`)}
                  >
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.niche ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={planBadgeVariant(c.plan)}>{c.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{c.customers}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.servicesThisMonth}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(c.createdAt)}
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
