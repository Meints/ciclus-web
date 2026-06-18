import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, getCookieValue } from "./auth";
import { useAuthStore } from "@/store/auth.store";
import type { ApiErrorBody } from "@/types/api";

const UNSAFE_METHODS = new Set(["post", "put", "patch", "delete"]);

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toLowerCase();
  if (method && UNSAFE_METHODS.has(method)) {
    const csrfToken = getCookieValue(CSRF_COOKIE_NAME);
    if (csrfToken) {
      config.headers.set(CSRF_HEADER_NAME, csrfToken);
    }
  }
  return config;
});

let isRedirectingToLogin = false;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes("/auth/login");

    if (status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().clear();

      if (typeof window !== "undefined" && !isRedirectingToLogin) {
        isRedirectingToLogin = true;
        const redirectTo = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirectTo=${redirectTo}`;
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Erro inesperado na requisição";

    return Promise.reject(new Error(message));
  }
);
