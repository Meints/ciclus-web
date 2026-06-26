"use client";

import { Loader2Icon, LogOutIcon, ShieldAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useExitImpersonation } from "@/hooks/use-admin";

export function ImpersonationBanner() {
  const user = useAuthStore((state) => state.user);
  const exitImpersonation = useExitImpersonation();

  if (!user?.impersonating) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-amber-500 px-4 py-2 text-sm text-white">
      <div className="flex items-center gap-2">
        <ShieldAlertIcon className="h-4 w-4 shrink-0" />
        <span>
          Você está acessando como <strong>{user.companyName}</strong>. Todas as ações são reais.
        </span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 shrink-0 text-white hover:bg-amber-600 hover:text-white"
        onClick={() => exitImpersonation.mutate()}
        disabled={exitImpersonation.isPending}
      >
        {exitImpersonation.isPending ? (
          <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <LogOutIcon className="h-3.5 w-3.5" />
        )}
        Voltar ao Admin
      </Button>
    </div>
  );
}
