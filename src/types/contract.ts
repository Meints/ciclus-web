export type ContractFrequency = "MONTHLY" | "BIMONTHLY" | "QUARTERLY" | "SEMIANNUAL" | "YEARLY";
export type ContractStatus = "ACTIVE" | "ABOUT_TO_EXPIRE" | "EXPIRED" | "CANCELLED" | "PAUSED";
export type ServiceType =
  | "AIR_CONDITIONING"
  | "PEST_CONTROL"
  | "CLEANING"
  | "BUILDING_MAINTENANCE"
  | "OTHER";

export interface Contract {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  frequency: ContractFrequency;
  startDate: string;
  endDate: string;
  nextVisitDate: string | null;
  value: number;
  notes?: string | null;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractPayload {
  customerId: string;
  frequency: ContractFrequency;
  startDate: string;
  endDate: string;
  value: number;
  notes?: string;
}

export type UpdateContractPayload = {
  frequency?: ContractFrequency;
  startDate?: string;
  endDate?: string;
  value?: number;
  notes?: string;
  customerId?: string;
  status?: ContractStatus;
};

export interface ContractFilters {
  search?: string;
  status?: ContractStatus;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}
