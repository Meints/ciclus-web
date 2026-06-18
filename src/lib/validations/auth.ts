import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Informe o e-mail" })
    .min(1, "Informe o e-mail")
    .email("E-mail inválido"),
  password: z
    .string({ required_error: "Informe a senha" })
    .min(1, "Informe a senha")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Informe a senha atual" })
      .min(1, "Informe a senha atual"),
    newPassword: z
      .string({ required_error: "Informe a nova senha" })
      .min(6, "A nova senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z
      .string({ required_error: "Confirme a nova senha" })
      .min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
