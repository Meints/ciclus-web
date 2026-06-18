"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyService } from "@/services/company.service";
import { useAuthStore } from "@/store/auth.store";
import type { ServiceNiche } from "@/lib/service-types";

export function useUpdateCompanyNiche() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (niche: ServiceNiche) => companyService.updateNiche(niche),
    onSuccess: (data) => {
      if (user) {
        const updatedUser = { ...user, niche: data.niche };
        setUser(updatedUser);
        queryClient.setQueryData(["auth", "me"], updatedUser);
      }
      toast.success("Segmento de atuação atualizado.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar o segmento de atuação.");
    },
  });
}
