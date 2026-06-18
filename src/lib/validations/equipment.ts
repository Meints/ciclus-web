import { z } from "zod";

export const EQUIPMENT_TYPE_VALUES = [
  "AC_SPLIT",
  "AC_CASSETTE",
  "AC_WINDOW",
  "CHILLER",
  "FAN_COIL",
  "VRF_VRV",
  "EXHAUST_FAN",
  "AIR_CURTAIN",
  "OTHER",
] as const;

export const equipmentSchema = z.object({
  type: z.enum(EQUIPMENT_TYPE_VALUES, { required_error: "Selecione o tipo de equipamento" }),
  brand: z.string({ required_error: "Informe a marca" }).min(1, "Informe a marca"),
  model: z.string({ required_error: "Informe o modelo" }).min(1, "Informe o modelo"),
  capacity: z.string().optional(),
  serialNumber: z.string().optional(),
  location: z
    .string({ required_error: "Informe a localização no imóvel" })
    .min(1, "Informe a localização no imóvel"),
  installationDate: z.string().optional(),
  notes: z.string().optional(),
});

export type EquipmentFormValues = z.infer<typeof equipmentSchema>;
