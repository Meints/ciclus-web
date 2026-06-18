"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeService } from "@/services/employee.service";
import type { PaginationParams } from "@/types/api";
import type { CreateEmployeePayload, UpdateEmployeePayload } from "@/types/employee";

const EMPLOYEES_KEY = "employees";

export function useEmployees(params: PaginationParams) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, params],
    queryFn: () => employeeService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, id],
    queryFn: () => employeeService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeService.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
      toast.success(`${data.name} adicionado(a) à equipe.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível adicionar o membro da equipe.");
    },
  });
}

export function useUpdateEmployee(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => employeeService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
      queryClient.setQueryData([EMPLOYEES_KEY, id], data);
      toast.success("Membro da equipe atualizado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar o membro da equipe.");
    },
  });
}
