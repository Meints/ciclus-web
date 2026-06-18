"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { getDefaultRouteForRole, hasRole } from "@/lib/auth";
import type { LoginPayload, UserRole } from "@/types/auth";

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
      setInitialized(true);
    }
  }, [query.data, setUser, setInitialized]);

  useEffect(() => {
    if (query.isError) {
      setUser(null);
      setInitialized(true);
    }
  }, [query.isError, setUser, setInitialized]);

  return query;
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setUser(data.user);
      setInitialized(true);
      queryClient.setQueryData(["auth", "me"], data.user);
      toast.success(`Bem-vindo, ${data.user.name.split(" ")[0]}!`);
      router.push(getDefaultRouteForRole(data.user.role));
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível entrar. Verifique seus dados.");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clear = useAuthStore((state) => state.clear);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clear();
      queryClient.clear();
      router.push("/login");
    },
    onError: () => {
      clear();
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(payload),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível alterar a senha.");
    },
  });
}

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);
  const { isLoading } = useCurrentUser();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const needsOnboarding = Boolean(
    user && user.role === "OWNER" && !user.niche && pathname !== "/configuracoes"
  );

  useEffect(() => {
    if (!isInitialized || isLoading || redirected.current) return;

    if (!user) {
      redirected.current = true;
      router.replace("/login");
      return;
    }

    if (allowedRoles && !hasRole(user.role, allowedRoles)) {
      redirected.current = true;
      router.replace(getDefaultRouteForRole(user.role));
      return;
    }

    if (needsOnboarding) {
      redirected.current = true;
      router.replace("/configuracoes");
    }
  });

  return {
    user,
    isLoading: isLoading || !isInitialized,
    isAuthorized: Boolean(
      user && (!allowedRoles || hasRole(user.role, allowedRoles)) && !needsOnboarding
    ),
  };
}
