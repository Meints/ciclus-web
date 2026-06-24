import { z } from "zod";

export const contractSchema = z.object({
  customerId: z.string({ required_error: "Selecione o cliente" }).min(1, "Selecione o cliente"),
  frequency: z.enum(["MONTHLY", "BIMONTHLY", "QUARTERLY", "SEMIANNUAL", "YEARLY"], {
    required_error: "Selecione a periodicidade",
  }),
  startDate: z.string({ required_error: "Informe a data de início" }).min(1, "Informe a data de início"),
  endDate: z.string({ required_error: "Informe a data de término" }).min(1, "Informe a data de término"),
  value: z.coerce
    .number({ invalid_type_error: "Informe um valor válido" })
    .positive("O valor deve ser maior que zero"),
  notes: z.string().optional(),
});

export type ContractFormValues = z.infer<typeof contractSchema>;
