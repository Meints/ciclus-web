import { z } from "zod";

export const serviceSchema = z.object({
  contractId: z.string({ required_error: "Selecione o contrato" }).min(1, "Selecione o contrato"),
  customerId: z.string({ required_error: "Selecione o cliente" }).min(1, "Selecione o cliente"),
  serviceType: z
    .string({ required_error: "Selecione o tipo de serviço" })
    .min(1, "Selecione o tipo de serviço"),
  scheduledDate: z
    .string({ required_error: "Informe a data agendada" })
    .min(1, "Informe a data agendada"),
  employeeId: z.string().optional(),
  equipmentIds: z.array(z.string()).optional().default([]),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const completeServiceSchema = z.object({
  executionNotes: z
    .string({ required_error: "Descreva as observações do serviço" })
    .min(5, "Descreva as observações do serviço"),
  equipmentNotes: z
    .array(z.object({ equipmentId: z.string(), note: z.string() }))
    .optional(),
});

export type CompleteServiceFormValues = z.infer<typeof completeServiceSchema>;
