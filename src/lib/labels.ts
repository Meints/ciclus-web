import type { ContractFrequency, ContractStatus, ServiceType } from "@/types/contract";
import type { ServiceStatus } from "@/types/service";
import type { CustomerStatus } from "@/types/customer";
import type { EmployeeStatus } from "@/types/employee";
import type { EquipmentStatus } from "@/types/equipment";
import { EQUIPMENT_TYPES_BY_NICHE } from "@/lib/equipment-types";

export const EQUIPMENT_TYPE_LABELS: Record<string, string> = Object.values(
  EQUIPMENT_TYPES_BY_NICHE
).reduce<Record<string, string>>((labels, options) => {
  for (const option of options) {
    labels[option.value] = option.label;
  }
  return labels;
}, {});

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  AIR_CONDITIONING: "Ar-condicionado",
  PEST_CONTROL: "Dedetização",
  CLEANING: "Limpeza",
  BUILDING_MAINTENANCE: "Manutenção predial",
  OTHER: "Outro",
};

export const CONTRACT_FREQUENCY_LABELS: Record<ContractFrequency, string> = {
  MONTHLY: "Mensal",
  BIMONTHLY: "Bimestral",
  QUARTERLY: "Trimestral",
  SEMIANNUAL: "Semestral",
  YEARLY: "Anual",
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  ACTIVE: "Ativo",
  ABOUT_TO_EXPIRE: "Próximo ao vencimento",
  EXPIRED: "Vencido",
  CANCELLED: "Cancelado",
  PAUSED: "Pausado",
};

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  SCHEDULED: "Agendado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  CONFIRMED: "Confirmado",
  NOT_FOUND: "Não encontrado",
  RESCHEDULED: "Reagendado",
};

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

export const CONTRACT_STATUS_VARIANTS: Record<ContractStatus, BadgeVariant> = {
  ACTIVE: "success",
  ABOUT_TO_EXPIRE: "warning",
  EXPIRED: "destructive",
  CANCELLED: "secondary",
  PAUSED: "outline",
};

export const SERVICE_STATUS_VARIANTS: Record<ServiceStatus, BadgeVariant> = {
  SCHEDULED: "default",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "secondary",
  CONFIRMED: "success",
  NOT_FOUND: "destructive",
  RESCHEDULED: "warning",
};

export const CUSTOMER_STATUS_VARIANTS: Record<CustomerStatus, BadgeVariant> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
};

export const EMPLOYEE_STATUS_VARIANTS: Record<EmployeeStatus, BadgeVariant> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
};

export const EQUIPMENT_STATUS_VARIANTS: Record<EquipmentStatus, BadgeVariant> = {
  ACTIVE: "success",
  INACTIVE: "secondary",
};
