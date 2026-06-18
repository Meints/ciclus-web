"use client";

import { use, useState } from "react";
import { Loader2Icon, PencilIcon, PlusIcon, PowerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { CustomerCard } from "@/components/customers/customer-card";
import { CustomerForm } from "@/components/customers/customer-form";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { EquipmentTable } from "@/components/equipment/equipment-table";
import { useCustomer, useUpdateCustomer } from "@/hooks/use-customers";
import { useContracts } from "@/hooks/use-contracts";
import { useServices } from "@/hooks/use-services";
import {
  useCreateEquipment,
  useCustomerEquipment,
  useToggleEquipment,
  useUpdateEquipment,
} from "@/hooks/use-equipment";
import { CONTRACT_STATUS_LABELS, CONTRACT_STATUS_VARIANTS, SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS, SERVICE_TYPE_LABELS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CustomerFormValues } from "@/lib/validations/customer";
import type { EquipmentFormValues } from "@/lib/validations/equipment";
import type { Equipment } from "@/types/equipment";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isEquipmentFormOpen, setIsEquipmentFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const { data: customer, isLoading } = useCustomer(id);
  const updateCustomer = useUpdateCustomer(id);

  const { data: contracts, isLoading: isContractsLoading } = useContracts({
    customerId: id,
    page: 1,
    pageSize: 50,
  });
  const { data: services, isLoading: isServicesLoading } = useServices({
    customerId: id,
    page: 1,
    pageSize: 50,
  });

  const { data: equipmentList, isLoading: isEquipmentLoading } = useCustomerEquipment(id);
  const createEquipment = useCreateEquipment(id);
  const updateEquipment = useUpdateEquipment(id, editingEquipment?.id ?? "");
  const toggleEquipment = useToggleEquipment(id);

  function handleOpenNewEquipment() {
    setEditingEquipment(null);
    setIsEquipmentFormOpen(true);
  }

  function handleOpenEditEquipment(item: Equipment) {
    setEditingEquipment(item);
    setIsEquipmentFormOpen(true);
  }

  function handleEquipmentSubmit(values: EquipmentFormValues) {
    if (editingEquipment) {
      updateEquipment.mutate(values, { onSuccess: () => setIsEquipmentFormOpen(false) });
    } else {
      createEquipment.mutate(values, { onSuccess: () => setIsEquipmentFormOpen(false) });
    }
  }

  function handleEditSubmit(values: CustomerFormValues) {
    updateCustomer.mutate(
      {
        ...values,
        tradeName: values.tradeName || undefined,
        email: values.email || undefined,
        address: {
          ...values.address,
          complement: values.address.complement || undefined,
        },
      },
      { onSuccess: () => setIsEditOpen(false) }
    );
  }

  function handleDeactivate() {
    if (!customer) return;
    updateCustomer.mutate(
      { status: customer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
      { onSuccess: () => setIsDeactivateOpen(false) }
    );
  }

  if (isLoading || !customer) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={customer.legalName}
        description="Detalhes do cliente, contratos e histórico de serviços"
        actions={
          <>
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              <PencilIcon />
              Editar
            </Button>
            <Button
              variant={customer.status === "ACTIVE" ? "destructive" : "default"}
              onClick={() => setIsDeactivateOpen(true)}
            >
              <PowerIcon />
              {customer.status === "ACTIVE" ? "Desativar" : "Reativar"}
            </Button>
          </>
        }
      />

      <CustomerCard customer={customer} />

      <Tabs defaultValue="contratos">
        <TabsList>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="historico">Histórico de serviços</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="contratos">
          <Card>
            <CardContent className="p-0">
              {isContractsLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : !contracts || contracts.data.length === 0 ? (
                <EmptyState
                  title="Nenhum contrato"
                  description="Este cliente ainda não possui contratos cadastrados."
                />
              ) : (
                <div className="divide-y">
                  {contracts.data.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{SERVICE_TYPE_LABELS[contract.serviceType]}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(contract.value)} · próxima visita{" "}
                          {contract.nextVisitDate ? formatDate(contract.nextVisitDate) : "—"}
                        </p>
                      </div>
                      <StatusBadge
                        label={CONTRACT_STATUS_LABELS[contract.status]}
                        variant={CONTRACT_STATUS_VARIANTS[contract.status]}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardContent className="p-0">
              {isServicesLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : !services || services.data.length === 0 ? (
                <EmptyState
                  title="Nenhum serviço registrado"
                  description="Este cliente ainda não possui ordens de serviço."
                />
              ) : (
                <div className="divide-y">
                  {services.data.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{getServiceTypeLabel(service.serviceType)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(service.scheduledDate)} ·{" "}
                          {service.employeeName ?? "Sem técnico"}
                        </p>
                      </div>
                      <StatusBadge
                        label={SERVICE_STATUS_LABELS[service.status]}
                        variant={SERVICE_STATUS_VARIANTS[service.status]}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipamentos">
          <Card>
            <CardContent className="flex flex-col gap-4 p-0">
              <div className="flex justify-end p-4 pb-0">
                <Button size="sm" onClick={handleOpenNewEquipment}>
                  <PlusIcon />
                  Novo equipamento
                </Button>
              </div>
              {isEquipmentLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <EquipmentTable
                  data={equipmentList ?? []}
                  onEdit={handleOpenEditEquipment}
                  onToggle={(item) => toggleEquipment.mutate(item.id)}
                  isToggling={toggleEquipment.isPending}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEquipmentFormOpen} onOpenChange={setIsEquipmentFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? "Editar equipamento" : "Novo equipamento"}
            </DialogTitle>
          </DialogHeader>
          <EquipmentForm
            defaultValues={
              editingEquipment
                ? {
                    type: editingEquipment.type,
                    brand: editingEquipment.brand,
                    model: editingEquipment.model,
                    capacity: editingEquipment.capacity ?? "",
                    serialNumber: editingEquipment.serialNumber ?? "",
                    location: editingEquipment.location,
                    installationDate: editingEquipment.installationDate?.slice(0, 10) ?? "",
                    notes: editingEquipment.notes ?? "",
                  }
                : undefined
            }
            onSubmit={handleEquipmentSubmit}
            isSubmitting={createEquipment.isPending || updateEquipment.isPending}
            submitLabel={editingEquipment ? "Salvar alterações" : "Cadastrar equipamento"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>
          <CustomerForm
            defaultValues={{
              legalName: customer.legalName,
              tradeName: customer.tradeName ?? "",
              documentType: customer.documentType,
              document: customer.document,
              email: customer.email ?? "",
              phone: customer.phone,
              address: {
                ...customer.address,
                complement: customer.address.complement ?? undefined,
              },
            }}
            onSubmit={handleEditSubmit}
            isSubmitting={updateCustomer.isPending}
            submitLabel="Salvar alterações"
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        title={customer.status === "ACTIVE" ? "Desativar cliente" : "Reativar cliente"}
        description={
          customer.status === "ACTIVE"
            ? "O cliente será marcado como inativo e não aparecerá em novas operações."
            : "O cliente voltará a ficar disponível para novas operações."
        }
        confirmLabel={customer.status === "ACTIVE" ? "Desativar" : "Reativar"}
        destructive={customer.status === "ACTIVE"}
        isLoading={updateCustomer.isPending}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
