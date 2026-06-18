import { z } from "zod";
import { isValidDocument, onlyDigits } from "@/lib/document";

export const customerAddressSchema = z.object({
  zipCode: z
    .string({ required_error: "Informe o CEP" })
    .min(1, "Informe o CEP")
    .refine((v) => onlyDigits(v).length === 8, "CEP inválido"),
  street: z.string({ required_error: "Informe o logradouro" }).min(1, "Informe o logradouro"),
  number: z.string({ required_error: "Informe o número" }).min(1, "Informe o número"),
  complement: z.string().optional(),
  neighborhood: z
    .string({ required_error: "Informe o bairro" })
    .min(1, "Informe o bairro"),
  city: z.string({ required_error: "Informe a cidade" }).min(1, "Informe a cidade"),
  state: z
    .string({ required_error: "Informe o estado" })
    .length(2, "Use a sigla do estado (UF)"),
});

export const customerSchema = z.object({
  legalName: z
    .string({ required_error: "Informe a razão social" })
    .min(3, "A razão social deve ter no mínimo 3 caracteres"),
  tradeName: z.string().optional(),
  documentType: z.enum(["CPF", "CNPJ"], {
    required_error: "Selecione o tipo de documento",
  }),
  document: z
    .string({ required_error: "Informe o documento" })
    .min(1, "Informe o documento"),
  email: z
    .string()
    .optional()
    .refine((v) => !v || z.string().email().safeParse(v).success, "E-mail inválido"),
  phone: z
    .string({ required_error: "Informe o telefone" })
    .refine((v) => onlyDigits(v).length >= 10, "Telefone inválido"),
  address: customerAddressSchema,
}).refine((data) => isValidDocument(data.document), {
  message: "Documento inválido",
  path: ["document"],
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
