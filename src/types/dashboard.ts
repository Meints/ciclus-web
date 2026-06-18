import type { ServiceStatus } from "./service";
import type { ServiceType } from "./contract";

export interface DashboardSummary {
  activeCustomers: number;
  activeContracts: number;
  servicesThisMonth: number;
  contractsExpiringIn30Days: number;
}

export interface UpcomingService {
  id: string;
  customerName: string;
  employeeName: string | null;
  scheduledDate: string;
  serviceType: string;
  status: ServiceStatus;
}

export interface ExpiringContract {
  id: string;
  customerName: string;
  serviceType: ServiceType;
  expiresAt: string;
  daysRemaining: number;
}
