"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { companyService } from "@/services/company.service";
import { useAuthStore } from "@/store/auth.store";
import { getDefaultRouteForRole } from "@/lib/auth";
import type { ServiceNiche } from "@/lib/service-types";

export function useUpdateCompanyNiche() {
  const router = useRouter();
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
      router.push(getDefaultRouteForRole(user?.role ?? "OWNER"));
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar o segmento de atuação.");
    },
  });
}

export function useUploadCompanyLogo() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (file: File) => companyService.uploadLogo(file),
    onSuccess: (data) => {
      if (user) {
        const updatedUser = { ...user, logoUrl: data.logoUrl, avatarUrl: data.logoUrl };
        setUser(updatedUser);
        queryClient.setQueryData(["auth", "me"], updatedUser);
      }
      toast.success("Logo atualizada com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível enviar a logo.");
    },
  });
}
