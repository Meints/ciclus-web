"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { serviceService } from "@/services/service.service";
import type { PaginationParams } from "@/types/api";
import type {
  CompleteServicePayload,
  CreateServicePayload,
  ServiceFilters,
  UpdateServicePayload,
} from "@/types/service";

const SERVICES_KEY = "services";

export function useServices(params: PaginationParams & ServiceFilters) {
  return useQuery({
    queryKey: [SERVICES_KEY, params],
    queryFn: () => serviceService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: [SERVICES_KEY, id],
    queryFn: () => serviceService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => serviceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success("Ordem de serviço criada com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível criar a ordem de serviço.");
    },
  });
}

export function useUpdateService(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateServicePayload) => serviceService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      queryClient.setQueryData([SERVICES_KEY, id], data);
      toast.success("Ordem de serviço atualizada.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar a ordem de serviço.");
    },
  });
}

export function useCompleteService(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompleteServicePayload) => serviceService.complete(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      queryClient.setQueryData([SERVICES_KEY, id], data);
      toast.success("Execução registrada e laudo gerado com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível registrar a execução.");
    },
  });
}

export function useResendConfirmation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => serviceService.resendConfirmation(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      queryClient.setQueryData([SERVICES_KEY, id], data);
      toast.success("Novo link de confirmação gerado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível gerar um novo link.");
    },
  });
}

export function useUploadServicePhoto(serviceId: string) {
  return useMutation({
    mutationFn: (file: File) => serviceService.uploadPhoto(serviceId, file),
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível enviar a foto.");
    },
  });
}
