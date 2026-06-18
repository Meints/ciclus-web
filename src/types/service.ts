import type { Equipment } from "./equipment";

export type ServiceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type ConfirmationStatus = "PENDING" | "CONFIRMED";

export interface ServiceEquipmentNote {
  equipmentId: string;
  note: string;
}

export interface ServiceExecution {
  notes: string;
  photoUrls: string[];
  equipmentNotes?: ServiceEquipmentNote[];
  completedAt: string;
}

export interface Service {
  id: string;
  companyId: string;
  contractId: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string | null;
  serviceType: string;
  scheduledDate: string;
  employeeId: string | null;
  employeeName: string | null;
  status: ServiceStatus;
  equipment?: string | null;
  equipmentIds: string[];
  equipmentDetails?: Equipment[];
  execution?: ServiceExecution | null;
  reportPdfUrl?: string | null;
  confirmationStatus?: ConfirmationStatus | null;
  confirmationToken?: string | null;
  confirmationLink?: string | null;
  confirmationExpiresAt?: string | null;
  confirmedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  contractId: string;
  customerId: string;
  serviceType: string;
  scheduledDate: string;
  employeeId?: string;
  equipmentIds?: string[];
}

export type UpdateServicePayload = Partial<
  Pick<CreateServicePayload, "scheduledDate" | "employeeId" | "equipmentIds">
> & {
  status?: ServiceStatus;
};

export interface CompleteServicePayload {
  notes: string;
  photoUrls?: string[];
  equipmentNotes?: ServiceEquipmentNote[];
  signatureDataUrl?: string;
}

export interface ServiceFilters {
  search?: string;
  status?: ServiceStatus;
  employeeId?: string;
  customerId?: string;
  contractId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}
