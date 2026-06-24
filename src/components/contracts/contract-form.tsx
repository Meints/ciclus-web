"use client";

import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/shared/currency-input";
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
import { CustomerCombobox } from "@/components/customers/customer-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { contractSchema, type ContractFormValues } from "@/lib/validations/contract";
import { CONTRACT_FREQUENCY_LABELS } from "@/lib/labels";

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const QUICK_OPTIONS = [
  { label: "6 meses", days: 180 },
  { label: "1 ano", days: 365 },
  { label: "2 anos", days: 730 },
];

interface ContractFormProps {
  defaultValues?: Partial<ContractFormValues>;
  onSubmit: (values: ContractFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ContractForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Salvar contrato",
}: ContractFormProps) {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      customerId: "",
      frequency: "MONTHLY",
      startDate: formatDate(new Date()),
      endDate: "",
      value: 0,
      notes: "",
      ...defaultValues,
    },
  });

  const startDate = form.watch("startDate");

  const applyQuickEndDate = useCallback(
    (label: string, days: number) => {
      if (!startDate) return;
      const end = addDays(new Date(startDate), days);
      form.setValue("endDate", formatDate(end), { shouldValidate: true });
    },
    [form, startDate],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do contrato</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <CustomerCombobox value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodicidade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CONTRACT_FREQUENCY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de início</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="self-start">
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <CurrencyInput value={field.value} onChange={field.onChange} placeholder="0,00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="self-start">
                  <FormLabel>Data de término</FormLabel>
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <div className="flex flex-wrap gap-1">
                      {QUICK_OPTIONS.map((opt) => (
                        <Button
                          key={opt.label}
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!startDate}
                          onClick={() => applyQuickEndDate(opt.label, opt.days)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações sobre o contrato (opcional)" {...field} />
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
