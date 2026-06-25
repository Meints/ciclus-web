import type { Equipment } from "./equipment";

export type ServiceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "CONFIRMED" | "NOT_FOUND" | "RESCHEDULED";
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
  scheduledTime?: string | null;
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
  confirmedName?: string | null;
  confirmedDocument?: string | null;
  confirmedDocumentType?: string | null;
  estimatedDurationMinutes?: number | null;
  durationMinutes?: number | null;
  isPaid?: boolean;
  checklistData?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  contractId: string;
  customerId: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime?: string;
  employeeId?: string;
  estimatedDurationMinutes?: number;
  equipmentIds?: string[];
}

export interface UpdateServicePayload {
  contractId?: string;
  customerId?: string;
  serviceType?: string;
  scheduledDate?: string;
  scheduledTime?: string | null;
  employeeId?: string | null;
  equipmentIds?: string[];
  status?: ServiceStatus;
}

export interface CompleteServicePayload {
  executionNotes: string;
  durationMinutes?: number;
  equipmentNotes?: ServiceEquipmentNote[];
  checklistData?: Record<string, unknown>;
}

export interface ServiceHistoryEntry {
  id: string;
  action: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  userName: string | null;
  createdAt: string;
}

export interface ServiceFilters {
  search?: string;
  status?: ServiceStatus;
  employeeId?: string;
  customerId?: string;
  contractId?: string;
  dateStart?: string;
  dateEnd?: string;
}
