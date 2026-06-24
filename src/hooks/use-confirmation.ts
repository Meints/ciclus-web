"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmationService } from "@/services/confirmation.service";
import type { ConfirmationData, ConfirmPayload } from "@/types/confirmation";
import type { ApiErrorBody } from "@/types/api";
import type { AxiosError } from "axios";

type ConfirmationStatus = "pending" | "confirmed" | "expired" | "not_found" | "error";

export interface ConfirmationSummary {
  status: ConfirmationStatus;
  data?: ConfirmationData;
  confirmedAt?: string;
}

const CONFIRMATION_KEY = "confirmation";

export function useConfirmationSummary(token: string) {
  return useQuery<ConfirmationSummary>({
    queryKey: [CONFIRMATION_KEY, token],
    queryFn: async () => {
      try {
        const data = await confirmationService.getSummary(token);
        if (data.alreadyConfirmed) {
          return { status: "confirmed" as const, confirmedAt: data.confirmedAt };
        }
        if (data.serviceNumber) {
          return { status: "pending" as const, data };
        }
        return { status: "not_found" as const };
      } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorBody>;
        const errorCode = axiosErr.response?.data?.error;
        if (errorCode === "EXPIRED" || axiosErr.response?.status === 410) {
          return { status: "expired" as const };
        }
        if (errorCode === "NOT_FOUND" || axiosErr.response?.status === 404) {
          return { status: "not_found" as const };
        }
        return { status: "error" as const };
      }
    },
    enabled: Boolean(token),
    retry: false,
  });
}

export function useConfirmService(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConfirmPayload) => confirmationService.confirm(token, payload),
    onSuccess: (data) => {
      queryClient.setQueryData([CONFIRMATION_KEY, token], { status: "confirmed", confirmedAt: data.confirmedAt });
    },
  });
}
