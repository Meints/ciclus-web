export type ContractFrequency = "MONTHLY" | "QUARTERLY" | "SEMIANNUAL" | "ANNUAL";
export type ContractStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
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
  serviceType: ServiceType;
  frequency: ContractFrequency;
  startDate: string;
  nextVisitDate: string | null;
  value: number;
  responsibleEmployeeId: string | null;
  responsibleEmployeeName: string | null;
  notes?: string | null;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractPayload {
  customerId: string;
  serviceType: ServiceType;
  frequency: ContractFrequency;
  startDate: string;
  value: number;
  responsibleEmployeeId?: string;
  notes?: string;
}

export type UpdateContractPayload = Partial<CreateContractPayload> & {
  status?: ContractStatus;
};

export interface ContractFilters {
  search?: string;
  status?: ContractStatus;
  serviceType?: ServiceType;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}
