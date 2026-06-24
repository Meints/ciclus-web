import type { ServiceStatus } from "./service";

export interface DashboardSummary {
  activeCustomers: number;
  activeContracts: number;
  servicesThisMonth: number;
  contractsExpiringIn30Days: number;
  delayedServices: number;
  techniciansBusyToday: number;
  totalTechnicians: number;
  totalContractValue: number;
  monthlyRecurringRevenue: number;
  servicesCompletedThisMonth: number;
  servicesScheduledToday: number;
  confirmationRate: number;
  averageCompletionHours: number;
}

export interface UpcomingService {
  id: string;
  customerName: string;
  customerAddress: string;
  employeeName: string | null;
  employeeId: string | null;
  scheduledDate: string;
  scheduledTime?: string | null;
  estimatedDurationMinutes?: number | null;
  serviceType: string;
  status: ServiceStatus;
}

export interface ExpiringContract {
  id: string;
  customerName: string;
  customerId: string;
  expiresAt: string;
  daysRemaining: number;
  value: number;
}

export interface TechnicianStatus {
  id: string;
  name: string;
  servicesToday: number;
  completedToday: number;
  currentServiceId: string | null;
  currentServiceCustomer: string | null;
  status: "FREE" | "BUSY" | "OFFLINE";
}

export interface MonthlyRevenue {
  month: string;
  value: number;
  services: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userName: string | null;
  createdAt: string;
  description: string;
}

export interface DashboardCalendarService {
  id: string;
  customerName: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime?: string | null;
  estimatedDurationMinutes?: number | null;
  employeeName: string | null;
  status: ServiceStatus;
}
