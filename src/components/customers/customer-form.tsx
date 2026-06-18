"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { customerSchema, type CustomerFormValues } from "@/lib/validations/customer";
import { maskDocument, maskPhone, maskZipCode, onlyDigits } from "@/lib/document";

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>;
  onSubmit: (values: CustomerFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Salvar cliente",
}: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      legalName: "",
      tradeName: "",
      documentType: "CNPJ",
      document: "",
      email: "",
      phone: "",
      address: {
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      },
      ...defaultValues,
    },
  });

  const documentType = form.watch("documentType");

  async function handleZipCodeBlur() {
    const zipCode = form.getValues("address.zipCode");
    const cleaned = onlyDigits(zipCode ?? "");
    if (cleaned.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;

      form.setValue("address.street", data.logradouro ?? "", { shouldValidate: true });
      form.setValue("address.neighborhood", data.bairro ?? "", { shouldValidate: true });
      form.setValue("address.city", data.localidade ?? "", { shouldValidate: true });
      form.setValue("address.state", data.uf ?? "", { shouldValidate: true });
    } catch {
      // silent fail — CEP lookup is optional convenience
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do cliente</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="legalName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Razão social</FormLabel>
                  <FormControl>
                    <Input placeholder="Razão social do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tradeName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Nome fantasia</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome fantasia (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("document", "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CNPJ">CNPJ</SelectItem>
                      <SelectItem value="CPF">CPF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{documentType === "CPF" ? "CPF" : "CNPJ"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                      value={maskDocument(field.value ?? "", documentType)}
                      onChange={(event) => field.onChange(onlyDigits(event.target.value))}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contato@cliente.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={maskPhone(field.value ?? "")}
                      onChange={(event) => field.onChange(onlyDigits(event.target.value))}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00000-000"
                      value={maskZipCode(field.value ?? "")}
                      onChange={(event) => field.onChange(onlyDigits(event.target.value))}
                      onBlur={handleZipCodeBlur}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, avenida..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Sala, bloco... (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SP"
                      maxLength={2}
                      {...field}
                      onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
