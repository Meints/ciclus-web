"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { serviceService } from "@/services/service.service";
import type { CompleteServicePayload } from "@/types/service";

const SERVICES_KEY = "services";

export function useStartService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceService.start(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success("Serviço iniciado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao iniciar serviço.");
    },
  });
}

export function useRevertService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceService.revert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success("Serviço revertido para agendado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao reverter serviço.");
    },
  });
}

export function useReopenService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceService.reopen(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success("Serviço reaberto.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao reabrir serviço.");
    },
  });
}

export function useCancelService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success("Serviço cancelado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao cancelar serviço.");
    },
  });
}

export function useCompleteService(serviceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompleteServicePayload) => serviceService.complete(serviceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success("Execução registrada e laudo gerado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao registrar execução.");
    },
  });
}
