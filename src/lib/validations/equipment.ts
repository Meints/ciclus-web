import { z } from "zod";

export const equipmentSchema = z.object({
  type: z
    .string({ required_error: "Selecione o tipo de equipamento" })
    .min(1, "Selecione o tipo de equipamento"),
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
