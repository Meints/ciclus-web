"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/services/customer.service";
import type { PaginationParams } from "@/types/api";
import type {
  CreateCustomerPayload,
  CustomerFilters,
  UpdateCustomerPayload,
} from "@/types/customer";

const CUSTOMERS_KEY = "customers";

export function useCustomers(params: PaginationParams & CustomerFilters) {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, params],
    queryFn: () => customerService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, id],
    queryFn: () => customerService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => customerService.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      toast.success(`Cliente "${data.legalName}" cadastrado com sucesso.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível cadastrar o cliente.");
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) => customerService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      queryClient.setQueryData([CUSTOMERS_KEY, id], data);
      toast.success("Cliente atualizado com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar o cliente.");
    },
  });
}

export function useToggleCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível alterar o status do cliente.");
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      toast.success("Cliente removido com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível remover o cliente.");
    },
  });
}
