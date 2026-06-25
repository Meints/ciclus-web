export interface ConfirmationEquipment {
  type: string;
  brand: string | null;
  model: string | null;
  location: string | null;
}

export interface ConfirmationData {
  alreadyConfirmed?: boolean;
  confirmedAt?: string;
  serviceNumber?: number;
  serviceType?: string | null;
  scheduledAt?: string;
  completedDate?: string | null;
  technicianName?: string | null;
  companyName?: string;
  companyLogo?: string | null;
  customerName?: string;
  equipment?: ConfirmationEquipment[];
}

export interface ConfirmPayload {
  name: string;
  document?: string;
  documentType?: "CPF" | "CNPJ";
  signatureDataUrl?: string;
}
