import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string({ required_error: "Informe o nome" })
    .min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
