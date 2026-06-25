"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminCompanies } from "@/hooks/use-admin";
import { planBadgeVariant } from "@/lib/admin-plans";
import { formatDate } from "@/lib/utils";

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminCompanies({
    search: search || undefined,
    plan,
    page,
    pageSize: 20,
  });

  const companies = data?.data ?? [];
  const meta = data?.meta;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePlanChange(value: string) {
    setPlan(value);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Empresas"
        description="Todas as empresas cadastradas na plataforma."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={plan} onValueChange={handlePlanChange}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os planos</SelectItem>
            <SelectItem value="FREE">Free</SelectItem>
            <SelectItem value="STARTER">Starter</SelectItem>
            <SelectItem value="PRO">Pro</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        ) : companies.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhuma empresa encontrada.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Nicho</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead className="text-right">Clientes</TableHead>
                <TableHead className="text-right">Contratos ativos</TableHead>
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
                  <TableCell className="text-right tabular-nums">{c.activeContracts}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.servicesThisMonth}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {meta.page} de {meta.totalPages} · {meta.total} empresas
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
