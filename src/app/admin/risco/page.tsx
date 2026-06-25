"use client";

import { useRouter } from "next/navigation";
import { ShieldCheckIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAtRiskCompanies } from "@/hooks/use-admin";
import { planBadgeVariant } from "@/lib/admin-plans";
import { formatDate } from "@/lib/utils";

function daysSince(dateIso: string): number {
  const diff = Date.now() - new Date(dateIso).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function AdminRiskPage() {
  const router = useRouter();
  const { data: companies, isLoading } = useAtRiskCompanies();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Empresas em risco"
        description="Empresas com mais de 30 dias e sem serviços registrados recentemente."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      ) : !companies || companies.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50">
            <ShieldCheckIcon className="h-6 w-6 text-success-600" />
          </div>
          <p className="text-sm font-medium text-foreground">Nenhuma empresa em risco</p>
          <p className="text-sm text-muted-foreground">
            Todas as empresas tiveram atividade recente. Boas notícias!
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Nicho</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead className="text-right">Total OS</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Dias sem atividade</TableHead>
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
                  <TableCell className="text-right tabular-nums">{c.totalServices}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                  <TableCell className="text-right tabular-nums text-danger-500">
                    {daysSince(c.createdAt)}+
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
