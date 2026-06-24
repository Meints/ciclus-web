export type EquipmentType = string;

export type EquipmentStatus = "ACTIVE" | "INACTIVE";

export interface Equipment {
  id: string;
  companyId: string;
  customerId: string;
  type: EquipmentType;
  brand: string;
  model: string;
  capacity?: string | null;
  serialNumber?: string | null;
  location: string;
  installationDate?: string | null;
  notes?: string | null;
  status: EquipmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentPayload {
  type: EquipmentType;
  brand: string;
  model: string;
  capacity?: string;
  serialNumber?: string;
  location: string;
  installationDate?: string;
  notes?: string;
}

export type UpdateEquipmentPayload = Partial<CreateEquipmentPayload> & {
  status?: EquipmentStatus;
};
