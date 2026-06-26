"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleIcon,
  DollarSignIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuthStore } from "@/store/auth.store";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPercent,
  cn,
} from "@/lib/utils";
import type { ExpiringContract, TechnicianStatus, UpcomingService } from "@/types/dashboard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
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

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: upcomingServices, isLoading: isServicesLoading } = useUpcomingServices();
  const { data: expiringContracts, isLoading: isContractsLoading } = useExpiringContracts();
  const { data: technicians, isLoading: isTechLoading } = useTechnicianStatus();


  const firstName = user?.name?.split(" ")[0] ?? "usuário";

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white shadow-md">
        <div className="relative z-10">
          <p className="text-sm font-medium text-brand-100">{getGreeting()},</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight">{firstName}</h1>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-brand-200" />
              <span>
                <span className="font-semibold">{isSummaryLoading ? "…" : (summary?.servicesScheduledToday ?? 0)}</span>{" "}
                <span className="text-brand-100">OS hoje</span>
              </span>
            </div>
            {(summary?.delayedServices ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="h-4 w-4 text-red-300" />
                <span>
                  <span className="font-semibold text-red-200">{summary!.delayedServices}</span>{" "}
                  <span className="text-brand-100">atrasada{summary!.delayedServices !== 1 ? "s" : ""}</span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-brand-200" />
              <span>
                <span className="font-semibold">
                  {isSummaryLoading ? "…" : (summary?.monthlyRecurringRevenue != null ? formatCompactCurrency(summary.monthlyRecurringRevenue) : "—")}
                </span>{" "}
                <span className="text-brand-100">MRR</span>
              </span>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -right-4 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* KPI strip operacional */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard
          label="Contratos ativos"
          value={summary?.activeContracts ?? 0}
          icon={FileTextIcon}
          variant="default"
          loading={isSummaryLoading}
          onClick={() => router.push("/contratos")}
        />
        <KpiCard
          label="OS atrasadas"
          value={summary?.delayedServices ?? 0}
          icon={AlertCircleIcon}
          variant={summary?.delayedServices ? "danger" : "default"}
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
          label="Taxa de confirmação"
          value={summary?.confirmationRate != null ? formatPercent(summary.confirmationRate) : "—"}
          icon={TrendingUpIcon}
          variant={summary?.confirmationRate != null && summary.confirmationRate >= 80 ? "success" : "warning"}
          loading={isSummaryLoading}
        />
      </div>

      {/* KPI strip financeiro */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          label="Faturado no mês"
          value={summary?.paidThisMonth != null ? formatCurrency(summary.paidThisMonth) : "—"}
          subtitle="OS pagas este mês"
          icon={DollarSignIcon}
          variant="success"
          loading={isSummaryLoading}
        />
        <KpiCard
          label="A receber"
          value={summary?.pendingPayment != null ? formatCurrency(summary.pendingPayment) : "—"}
          subtitle="OS concluídas não pagas"
          icon={TrendingUpIcon}
          variant={summary?.pendingPayment ? "warning" : "default"}
          loading={isSummaryLoading}
          onClick={() => router.push("/servicos")}
        />
        <KpiCard
          label="MRR"
          value={summary?.monthlyRecurringRevenue != null ? formatCurrency(summary.monthlyRecurringRevenue) : "—"}
          subtitle="Receita recorrente mensal"
          icon={FileTextIcon}
          variant="default"
          loading={isSummaryLoading}
          onClick={() => router.push("/contratos")}
        />
      </div>

      {/* Onboarding — só aparece enquanto há etapas pendentes */}
      {summary && !isSummaryLoading && (
        <OnboardingChecklist summary={summary} />
      )}

      {/* Calendar + right panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Calendar — 2/3 */}
        <div className="lg:col-span-2">
          <ServiceCalendar />
        </div>

        {/* Right panel — 1/3 */}
        <div className="flex flex-col gap-4">
          {/* Upcoming 7 days */}
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Próximos 7 dias</CardTitle>
              <Link href="/servicos" className="flex items-center gap-1 text-xs text-brand-600 hover:underline">
                Ver todos <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {isServicesLoading ? (
                <div className="flex flex-col divide-y">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1.5 px-5 py-3">
                      <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                </div>
              ) : !upcomingServices || upcomingServices.length === 0 ? (
                <EmptyState title="Nenhum serviço" description="Sem OS nos próximos 7 dias." />
              ) : (
                <div className="flex flex-col divide-y">
                  {upcomingServices.slice(0, 6).map((service) => (
                    <UpcomingRow key={service.id} service={service} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expiring contracts */}
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Contratos vencendo</CardTitle>
              <Link href="/contratos" className="flex items-center gap-1 text-xs text-brand-600 hover:underline">
                Ver todos <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {isContractsLoading ? (
                <div className="flex flex-col divide-y">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1.5 px-5 py-3">
                      <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                </div>
              ) : !expiringContracts || expiringContracts.length === 0 ? (
                <EmptyState title="Nenhum vencendo" description="Sem contratos para renovar em 30 dias." />
              ) : (
                <div className="flex flex-col divide-y">
                  {expiringContracts.slice(0, 4).map((contract) => (
                    <ExpiringRow key={contract.id} contract={contract} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Technicians */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Equipe</CardTitle>
          <Link href="/equipe" className="flex items-center gap-1 text-xs text-brand-600 hover:underline">
            Gerenciar <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {isTechLoading ? (
            <div className="flex flex-col divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : !technicians || technicians.length === 0 ? (
            <EmptyState title="Nenhum técnico" description="Cadastre técnicos na equipe." />
          ) : (
            <div className="flex flex-col divide-y">
              {technicians.map((tech) => (
                <TechnicianRow key={tech.id} tech={tech} />
              ))}
              {summary && (
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="text-xs text-muted-foreground">
                    {summary.techniciansBusyToday} ocupados · {summary.totalTechnicians} no total
                  </span>
                  <span className="text-xs font-semibold text-brand-600">
                    {summary.totalTechnicians > 0
                      ? Math.round((summary.techniciansBusyToday / summary.totalTechnicians) * 100)
                      : 0}% ocupação
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OnboardingChecklist({ summary }: { summary: import("@/types/dashboard").DashboardSummary }) {
  const steps = [
    {
      label: "Cadastrar o primeiro cliente",
      done: summary.activeCustomers > 0,
      href: "/clientes",
    },
    {
      label: "Criar o primeiro contrato",
      done: summary.activeContracts > 0,
      href: "/contratos",
    },
    {
      label: "Agendar a primeira ordem de serviço",
      done: summary.totalServices > 0,
      href: "/servicos?quickCreate=true",
    },
  ];

  const allDone = steps.every((s) => s.done);
  if (allDone) return null;

  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-5 dark:border-brand-800 dark:bg-brand-950/30">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-brand-800 dark:text-brand-200">Primeiros passos</h3>
          <p className="mt-0.5 text-xs text-brand-600 dark:text-brand-400">
            {doneCount} de {steps.length} etapas concluídas
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-brand-200 dark:text-brand-800" />
            <circle
              cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3"
              strokeDasharray={`${(doneCount / steps.length) * 88} 88`}
              strokeLinecap="round"
              className="text-brand-600 transition-all duration-500"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <Link
            key={step.label}
            href={step.done ? "#" : step.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              step.done
                ? "cursor-default text-muted-foreground"
                : "cursor-pointer bg-white/70 font-medium text-brand-800 hover:bg-white dark:bg-brand-900/40 dark:text-brand-200 dark:hover:bg-brand-900/70",
            )}
          >
            {step.done ? (
              <CheckCircle2Icon className="h-4 w-4 shrink-0 text-success-500" />
            ) : (
              <CircleIcon className="h-4 w-4 shrink-0 text-brand-400" />
            )}
            <span className={step.done ? "line-through" : ""}>{step.label}</span>
            {!step.done && <ArrowRightIcon className="ml-auto h-3.5 w-3.5 text-brand-400" />}
          </Link>
        ))}
      </div>
    </div>
  );
}

function TechnicianRow({ tech }: { tech: TechnicianStatus }) {
  const statusConfig = {
    BUSY: { dot: "bg-warning-500", label: "Ocupado", text: "text-warning-600" },
    FREE: { dot: "bg-success-500", label: "Disponível", text: "text-success-600" },
    OFFLINE: { dot: "bg-gray-300", label: "Off-line", text: "text-muted-foreground" },
  };
  const s = statusConfig[tech.status];

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
          {tech.name.charAt(0).toUpperCase()}
          <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card", s.dot)} />
        </div>
        <div>
          <p className="text-sm font-medium leading-tight">{tech.name}</p>
          <p className={cn("text-xs", s.text)}>
            {tech.status === "BUSY" && tech.currentServiceCustomer
              ? `Em: ${tech.currentServiceCustomer}`
              : s.label}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums">{tech.completedToday}/{tech.servicesToday}</p>
        <p className="text-xs text-muted-foreground">OS</p>
      </div>
    </div>
  );
}

function UpcomingRow({ service }: { service: UpcomingService }) {
  return (
    <Link
      href={`/servicos/${service.id}`}
      className="flex cursor-pointer items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{service.customerName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {getServiceTypeLabel(service.serviceType)} ·{" "}
          {formatDate(service.scheduledDate)}
          {service.scheduledTime && ` às ${service.scheduledTime.slice(0, 5)}`}
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
      href={`/contratos/${contract.id}`}
      className="flex cursor-pointer items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{contract.customerName}</p>
        <p className="text-xs text-muted-foreground">
          Vence em {formatDate(contract.expiresAt)} · {formatCurrency(contract.value)}
        </p>
      </div>
      <StatusBadge
        label={`${contract.daysRemaining}d`}
        variant={contract.daysRemaining <= 7 ? "destructive" : "warning"}
      />
    </Link>
  );
}

