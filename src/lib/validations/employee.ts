import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string({ required_error: "Informe o nome" })
    .min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z
    .string({ required_error: "Informe o e-mail" })
    .min(1, "Informe o e-mail")
    .email("E-mail inválido"),
  password: z
    .string({ required_error: "Informe a senha" })
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["OWNER", "ADMIN", "TECHNICIAN"], {
    required_error: "Selecione a função",
  }),
  phone: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
