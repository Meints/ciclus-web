"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { contractService } from "@/services/contract.service";
import type { PaginationParams } from "@/types/api";
import type {
  ContractFilters,
  CreateContractPayload,
  UpdateContractPayload,
} from "@/types/contract";

const CONTRACTS_KEY = "contracts";

export function useContracts(params: PaginationParams & ContractFilters) {
  return useQuery({
    queryKey: [CONTRACTS_KEY, params],
    queryFn: () => contractService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: [CONTRACTS_KEY, id],
    queryFn: () => contractService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContractPayload) => contractService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
      toast.success("Contrato criado com sucesso. A primeira OS já foi agendada.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível criar o contrato.");
    },
  });
}

export function useUpdateContract(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateContractPayload) => contractService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
      queryClient.setQueryData([CONTRACTS_KEY, id], data);
      toast.success("Contrato atualizado com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar o contrato.");
    },
  });
}

export function useCancelContract(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => contractService.cancel(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
      queryClient.setQueryData([CONTRACTS_KEY, id], data);
      toast.success("Contrato cancelado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível cancelar o contrato.");
    },
  });
}
