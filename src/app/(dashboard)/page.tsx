"use client";

import Link from "next/link";
import { AlertCircleIcon, FileTextIcon, UsersIcon, WrenchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { ServiceCalendar } from "@/components/dashboard/service-calendar";
import {
  useDashboardSummary,
  useExpiringContracts,
  useUpcomingServices,
} from "@/hooks/use-dashboard";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS, SERVICE_TYPE_LABELS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: upcomingServices, isLoading: isServicesLoading } = useUpcomingServices();
  const { data: expiringContracts, isLoading: isContractsLoading } = useExpiringContracts();

  const cards = [
    {
      label: "Contratos ativos",
      value: summary?.activeContracts,
      icon: FileTextIcon,
      iconBg: "bg-ciclus-blue-50",
      iconColor: "text-ciclus-blue-600",
      valueColor: "text-ciclus-blue-600",
    },
    {
      label: "OS esse mês",
      value: summary?.servicesThisMonth,
      icon: WrenchIcon,
      iconBg: "bg-ciclus-teal-50",
      iconColor: "text-ciclus-teal-600",
      valueColor: "text-ciclus-teal-600",
    },
    {
      label: "Vencendo em 30d",
      value: summary?.contractsExpiringIn30Days,
      icon: AlertCircleIcon,
      iconBg: "bg-ciclus-amber-50",
      iconColor: "text-ciclus-amber-600",
      valueColor: "text-ciclus-amber-600",
    },
    {
      label: "Clientes ativos",
      value: summary?.activeCustomers,
      icon: UsersIcon,
      iconBg: "bg-ciclus-gray-50",
      iconColor: "text-ciclus-gray-800",
      valueColor: "text-ciclus-gray-900",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Visão geral da sua operação" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isSummaryLoading
          ? Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)
          : cards.map((card) => (
              <Card key={card.label}>
                <CardContent className="px-5 py-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg} ${card.iconColor}`}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-xs text-ciclus-gray-600">{card.label}</p>
                  <p className={`text-[28px] font-medium leading-tight ${card.valueColor}`}>
                    {card.value ?? 0}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Agenda de serviços</h2>
        <ServiceCalendar />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos 7 dias</CardTitle>
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contratos vencendo em 30 dias</CardTitle>
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
                  <Link
                    key={contract.id}
                    href={`/contratos/${contract.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-accent/40"
                  >
                    <div>
                      <p className="text-sm font-medium">{contract.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {SERVICE_TYPE_LABELS[contract.serviceType]} · vence em{" "}
                        {formatDate(contract.expiresAt)}
                      </p>
                    </div>
                    <StatusBadge
                      label={`${contract.daysRemaining} dia(s)`}
                      variant={contract.daysRemaining <= 7 ? "destructive" : "warning"}
                    />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
