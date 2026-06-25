"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  DollarSignIcon,
  FileTextIcon,
  PenLineIcon,
  TrendingUpIcon,
  UserPlusIcon,
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
  useRecentActivity,
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
import type { ExpiringContract, RecentActivity, TechnicianStatus, UpcomingService } from "@/types/dashboard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function getActivityIcon(entityType: string, action: string) {
  if (action?.toLowerCase().includes("sign") || action?.toLowerCase().includes("confirm")) return PenLineIcon;
  if (entityType === "SERVICE" && action?.toLowerCase().includes("complet")) return CheckCircle2Icon;
  if (entityType === "CONTRACT") return FileTextIcon;
  if (entityType === "CUSTOMER") return UserPlusIcon;
  if (entityType === "SERVICE") return ClipboardListIcon;
  return CalendarIcon;
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
  const { data: recentActivity, isLoading: isActivityLoading } = useRecentActivity();

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

      {/* KPI strip */}
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

      {/* Technicians + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Atividade recente</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isActivityLoading ? (
              <div className="flex flex-col divide-y">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3">
                    <div className="mt-0.5 h-7 w-7 animate-pulse rounded-full bg-muted" />
                    <div className="flex flex-col gap-1.5">
                      <div className="h-3.5 w-40 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !recentActivity || recentActivity.length === 0 ? (
              <EmptyState title="Nenhuma atividade" description="As ações da equipe aparecerão aqui." />
            ) : (
              <div className="flex flex-col divide-y">
                {recentActivity.slice(0, 6).map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
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

function ActivityRow({ activity }: { activity: RecentActivity }) {
  const Icon = getActivityIcon(activity.entityType, activity.action);
  const iconColor = activity.action?.toLowerCase().includes("sign") || activity.action?.toLowerCase().includes("confirm")
    ? "bg-success-50 text-success-600"
    : activity.entityType === "SERVICE"
      ? "bg-brand-50 text-brand-600"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="flex items-start gap-3 px-5 py-3">
      <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", iconColor)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{activity.description}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {activity.userName && <span>{activity.userName} · </span>}
          {formatRelativeTime(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}
