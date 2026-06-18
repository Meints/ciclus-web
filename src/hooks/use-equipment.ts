"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { equipmentService } from "@/services/equipment.service";
import type { CreateEquipmentPayload, UpdateEquipmentPayload } from "@/types/equipment";

const EQUIPMENT_KEY = "equipment";

export function useCustomerEquipment(customerId: string | undefined) {
  return useQuery({
    queryKey: [EQUIPMENT_KEY, customerId],
    queryFn: () => equipmentService.list(customerId as string),
    enabled: Boolean(customerId),
  });
}

export function useCreateEquipment(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEquipmentPayload) => equipmentService.create(customerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY, customerId] });
      toast.success("Equipamento cadastrado com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível cadastrar o equipamento.");
    },
  });
}

export function useUpdateEquipment(customerId: string, equipmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEquipmentPayload) =>
      equipmentService.update(customerId, equipmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY, customerId] });
      toast.success("Equipamento atualizado com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar o equipamento.");
    },
  });
}

export function useToggleEquipment(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (equipmentId: string) => equipmentService.toggle(customerId, equipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQUIPMENT_KEY, customerId] });
      toast.success("Status do equipamento atualizado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar o status.");
    },
  });
}
