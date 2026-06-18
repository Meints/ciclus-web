"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon, PlayCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { serviceSchema, type ServiceFormValues } from "@/lib/validations/service";
import { CONTRACT_FREQUENCY_LABELS, SERVICE_TYPE_LABELS } from "@/lib/labels";
import { getServiceTypes } from "@/lib/service-types";
import { useContracts } from "@/hooks/use-contracts";
import { useEmployees } from "@/hooks/use-employees";
import { useCustomerEquipment } from "@/hooks/use-equipment";
import { useAuthStore } from "@/store/auth.store";

interface ServiceFormProps {
  id?: string;
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmitAndStart?: (values: ServiceFormValues) => void;
}

export function ServiceForm({
  id,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Criar OS",
  onSubmitAndStart,
}: ServiceFormProps) {
  const niche = useAuthStore((state) => state.user?.niche) ?? "GENERAL";
  const serviceTypeOptions = getServiceTypes(niche);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      customerId: "",
      contractId: "",
      serviceType: serviceTypeOptions[0]?.value ?? "",
      scheduledDate: new Date().toISOString().slice(0, 10),
      employeeId: "",
      equipmentIds: [],
      ...defaultValues,
    },
  });

  const customerId = form.watch("customerId");
  const equipmentIds = form.watch("equipmentIds");

  const { data: contracts } = useContracts({
    customerId: customerId || undefined,
    page: 1,
    pageSize: 50,
    status: "ACTIVE",
  });
  const { data: employees } = useEmployees({ page: 1, pageSize: 100 });
  const technicians = employees?.data ?? [];
  const { data: customerEquipment } = useCustomerEquipment(customerId || undefined);
  const activeEquipment = (customerEquipment ?? []).filter((item) => item.status === "ACTIVE");

  useEffect(() => {
    form.setValue("contractId", "");
    form.setValue("equipmentIds", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  function toggleEquipment(equipmentId: string, checked: boolean) {
    const current = form.getValues("equipmentIds");
    const next = checked
      ? [...current, equipmentId]
      : current.filter((id) => id !== equipmentId);
    form.setValue("equipmentIds", next, { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da ordem de serviço</CardTitle>
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
              name="contractId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Contrato</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!customerId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o contrato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contracts?.data.map((contract) => (
                        <SelectItem key={contract.id} value={contract.id}>
                          {SERVICE_TYPE_LABELS[contract.serviceType]} ·{" "}
                          {CONTRACT_FREQUENCY_LABELS[contract.frequency]}
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
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de serviço</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data agendada</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Técnico responsável</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um técnico (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians.map((technician) => (
                        <SelectItem key={technician.id} value={technician.id}>
                          {technician.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipamentos atendidos</CardTitle>
          </CardHeader>
          <CardContent>
            {!customerId ? (
              <p className="text-sm text-muted-foreground">
                Selecione um cliente para ver os equipamentos cadastrados.
              </p>
            ) : activeEquipment.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Este cliente não possui equipamentos ativos cadastrados.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {activeEquipment.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 rounded-md border p-3 text-sm"
                  >
                    <Checkbox
                      checked={equipmentIds.includes(item.id)}
                      onCheckedChange={(checked) => toggleEquipment(item.id, Boolean(checked))}
                    />
                    <span>
                      <span className="block font-medium">{item.brand} {item.model}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.location} {item.capacity ? `· ${item.capacity}` : ""}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {form.formState.errors.equipmentIds && (
              <p className="mt-2 text-sm font-medium text-destructive">
                {form.formState.errors.equipmentIds.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          {onSubmitAndStart && (
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={form.handleSubmit(onSubmitAndStart)}
            >
              <PlayCircleIcon className="h-4 w-4" />
              Criar e iniciar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
