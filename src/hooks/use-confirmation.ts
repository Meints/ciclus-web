"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { confirmationService } from "@/services/confirmation.service";

const CONFIRMATION_KEY = "confirmation";

export function useConfirmationSummary(token: string) {
  return useQuery({
    queryKey: [CONFIRMATION_KEY, token],
    queryFn: () => confirmationService.getSummary(token),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useConfirmService(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => confirmationService.confirm(token),
    onSuccess: (data) => {
      queryClient.setQueryData([CONFIRMATION_KEY, token], data);
    },
  });
}
