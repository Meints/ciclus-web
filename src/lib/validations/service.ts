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
  scheduledTime: z.string().optional(),
  estimatedDurationMinutes: z.coerce.number().int().positive("Informe a duração em minutos").optional(),
  employeeId: z.string().optional(),
  equipmentIds: z.array(z.string()).optional().default([]),
}).refine(
  (data) => !data.employeeId || (data.scheduledTime?.length ?? 0) > 0,
  { message: "Informe o horário quando um técnico for selecionado", path: ["scheduledTime"] },
);

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const completeServiceSchema = z.object({
  executionNotes: z
    .string({ required_error: "Descreva as observações do serviço" })
    .min(5, "Descreva as observações do serviço")
    .max(2000, "Máximo de 2000 caracteres"),
  durationMinutes: z.coerce.number().int().positive("Informe a duração em minutos").optional(),
  equipmentNotes: z
    .array(z.object({ equipmentId: z.string(), note: z.string() }))
    .optional(),
});

export type CompleteServiceFormValues = z.infer<typeof completeServiceSchema>;
