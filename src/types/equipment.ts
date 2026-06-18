export type EquipmentType =
  | "AC_SPLIT"
  | "AC_CASSETTE"
  | "AC_WINDOW"
  | "CHILLER"
  | "FAN_COIL"
  | "VRF_VRV"
  | "EXHAUST_FAN"
  | "AIR_CURTAIN"
  | "OTHER";

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
