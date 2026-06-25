import axios, { type AxiosError } from "axios";
import { useAuthStore } from "@/store/auth.store";
import type { ApiErrorBody } from "@/types/api";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && "data" in body && body.data !== undefined) {
      if (body.meta) {
        // Paginated: { data: [...], meta: {...} } - keep as-is
      } else if (Array.isArray(body.data)) {
        // Unpaginated list: { data: [...] } - unwrap
        response.data = body.data;
      } else if (body.data !== null) {
        // Single resource or auth: { data: {...} } - unwrap
        response.data = body.data;
      }
    }
    return response;
  },
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes("/auth/login");

    if (status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().clear();

      if (typeof window !== "undefined" && !window.__isRedirectingToLogin) {
        window.__isRedirectingToLogin = true;
        const redirectTo = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirectTo=${redirectTo}`;
      }
    }

    const message =
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      error.message ??
      "Erro inesperado na requisição";

    return Promise.reject(new Error(message));
  }
);

declare global {
  interface Window {
    __isRedirectingToLogin?: boolean;
  }
}
