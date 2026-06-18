import { z } from "zod";

export const contractSchema = z.object({
  customerId: z.string({ required_error: "Selecione o cliente" }).min(1, "Selecione o cliente"),
  serviceType: z.enum(
    ["AIR_CONDITIONING", "PEST_CONTROL", "CLEANING", "BUILDING_MAINTENANCE", "OTHER"],
    { required_error: "Selecione o tipo de serviço" }
  ),
  frequency: z.enum(["MONTHLY", "BIMONTHLY", "QUARTERLY", "SEMIANNUAL", "YEARLY"], {
    required_error: "Selecione a periodicidade",
  }),
  startDate: z.string({ required_error: "Informe a data de início" }).min(1, "Informe a data de início"),
  endDate: z.string({ required_error: "Informe a data de término" }).min(1, "Informe a data de término"),
  value: z.coerce
    .number({ invalid_type_error: "Informe um valor válido" })
    .positive("O valor deve ser maior que zero"),
  responsibleEmployeeId: z.string().optional(),
  notes: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof contractSchema>;
