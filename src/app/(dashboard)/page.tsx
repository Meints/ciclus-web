"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ServiceCalendar } from "@/components/dashboard/service-calendar";
import {
  useDashboardSummary,
  useExpiringContracts,
  useTechnicianStatus,
  useUpcomingServices,
} from "@/hooks/use-dashboard";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS, SERVICE_TYPE_LABELS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatCompactCurrency, formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import type { ExpiringContract, TechnicianStatus, UpcomingService } from "@/types/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: upcomingServices, isLoading: isServicesLoading } = useUpcomingServices();
  const { data: expiringContracts, isLoading: isContractsLoading } = useExpiringContracts();
  const { data: technicians, isLoading: isTechLoading } = useTechnicianStatus();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua operação"
      />

      {/* LINHA 1: KPIs principais */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Contratos ativos"
          value={summary?.activeContracts ?? 0}
          icon={FileTextIcon}
          variant="default"
          loading={isSummaryLoading}
          onClick={() => router.push("/contratos")}
        />
        <KpiCard
          label="Receita mensal"
          value={summary?.monthlyRecurringRevenue != null ? formatCompactCurrency(summary.monthlyRecurringRevenue) : "—"}
          icon={DollarSignIcon}
          variant="success"
          subtitle={summary?.servicesCompletedThisMonth != null ? `${summary.servicesCompletedThisMonth} OS este mês` : undefined}
          loading={isSummaryLoading}
        />
        <KpiCard
          label="OS atrasadas"
          value={summary?.delayedServices ?? 0}
          icon={AlertCircleIcon}
          variant={summary && summary.delayedServices != null && summary.delayedServices > 0 ? "danger" : "default"}
          loading={isSummaryLoading}
          onClick={() => router.push("/servicos")}
        />
        <KpiCard
          label="OS hoje"
          value={summary?.servicesScheduledToday ?? 0}
          icon={CalendarIcon}
          variant="default"
          loading={isSummaryLoading}
          onClick={() => router.push("/servicos")}
        />
        <KpiCard
          label="Clientes ativos"
          value={summary?.activeCustomers ?? 0}
          icon={UsersIcon}
          variant="default"
          loading={isSummaryLoading}
          onClick={() => router.push("/clientes")}
        />
        <KpiCard
          label="Confirmação"
          value={summary?.confirmationRate != null ? formatPercent(summary.confirmationRate) : "—"}
          icon={TrendingUpIcon}
          variant={summary?.confirmationRate != null && summary.confirmationRate >= 80 ? "success" : "warning"}
          loading={isSummaryLoading}
        />
      </div>

      {/* LINHA 2: Técnicos + Calendário */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agenda de serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceCalendar />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Técnicos</CardTitle>
            <Link href="/equipe" className="text-xs text-brand-600 hover:underline">
              Gerenciar
            </Link>
          </CardHeader>
          <CardContent>
            {isTechLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : !technicians || technicians.length === 0 ? (
              <EmptyState
                title="Nenhum técnico"
                description="Cadastre técnicos na equipe."
              />
            ) : (
              <div className="flex flex-col gap-2">
                {technicians.map((tech) => (
                  <TechnicianRow key={tech.id} tech={tech} />
                ))}
                {summary && (
                  <div className="mt-2 flex items-center justify-between rounded-md bg-muted/50 p-2 text-xs">
                    <span className="text-muted-foreground">
                      {summary.techniciansBusyToday} ocupados · {summary.totalTechnicians} total
                    </span>
                    <span className="font-medium text-brand-600">
                      {summary.totalTechnicians > 0
                        ? Math.round((summary.techniciansBusyToday / summary.totalTechnicians) * 100)
                        : 0}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* LINHA 3: Próximos serviços + Contratos vencendo */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos 7 dias</CardTitle>
            <Link href="/servicos" className="text-xs text-brand-600 hover:underline">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {isServicesLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-12 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : !upcomingServices || upcomingServices.length === 0 ? (
              <EmptyState
                title="Nenhum serviço agendado"
                description="Não há ordens de serviço previstas para esta semana."
              />
            ) : (
              <div className="flex flex-col divide-y">
                {upcomingServices.map((service) => (
                  <UpcomingRow key={service.id} service={service} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contratos vencendo em 30 dias</CardTitle>
            <Link href="/contratos" className="text-xs text-brand-600 hover:underline">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            {isContractsLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-12 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : !expiringContracts || expiringContracts.length === 0 ? (
              <EmptyState
                title="Nenhum contrato vencendo"
                description="Não há contratos próximos do vencimento."
              />
            ) : (
              <div className="flex flex-col divide-y">
                {expiringContracts.map((contract) => (
                  <ExpiringRow key={contract.id} contract={contract} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TechnicianRow({ tech }: { tech: TechnicianStatus }) {
  const statusIcon = {
    BUSY: "🟡",
    FREE: "🟢",
    OFFLINE: "⚪",
  };

  return (
    <div className="flex items-center justify-between rounded-md border p-2.5 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs">{statusIcon[tech.status]}</span>
        <div>
          <p className="font-medium">{tech.name}</p>
          <p className="text-xs text-muted-foreground">
            {tech.status === "BUSY" && tech.currentServiceCustomer
              ? `Em: ${tech.currentServiceCustomer}`
              : tech.status === "FREE"
                ? "Disponível"
                : "Off-line"}
          </p>
        </div>
      </div>
      <div className="text-right text-xs">
        <p className="font-medium">{tech.completedToday}/{tech.servicesToday}</p>
        <p className="text-muted-foreground">serviços</p>
      </div>
    </div>
  );
}

function UpcomingRow({ service }: { service: UpcomingService }) {
  return (
    <Link
      key={service.id}
      href={`/servicos/${service.id}`}
      className="flex items-center justify-between gap-3 py-3 hover:bg-accent/40"
    >
      <div>
        <p className="text-sm font-medium">{service.customerName}</p>
        <p className="text-xs text-muted-foreground">
          {getServiceTypeLabel(service.serviceType)} ·{" "}
          {service.employeeName ?? "Sem técnico"} ·{" "}
          {formatDate(service.scheduledDate)}
        </p>
      </div>
      <StatusBadge
        label={SERVICE_STATUS_LABELS[service.status]}
        variant={SERVICE_STATUS_VARIANTS[service.status]}
      />
    </Link>
  );
}

function ExpiringRow({ contract }: { contract: ExpiringContract }) {
  return (
    <Link
      key={contract.id}
      href={`/contratos/${contract.id}`}
      className="flex items-center justify-between gap-3 py-3 hover:bg-accent/40"
    >
      <div>
        <p className="text-sm font-medium">{contract.customerName}</p>
        <p className="text-xs text-muted-foreground">
          {SERVICE_TYPE_LABELS[contract.serviceType]} · vence em{" "}
          {formatDate(contract.expiresAt)} · {formatCurrency(contract.value)}
        </p>
      </div>
      <StatusBadge
        label={`${contract.daysRemaining} dia(s)`}
        variant={contract.daysRemaining <= 7 ? "destructive" : "warning"}
      />
    </Link>
  );
}
