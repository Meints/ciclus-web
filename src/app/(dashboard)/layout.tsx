"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { QuickActionBar } from "@/components/shared/quick-action-bar";
import { ConnectivityIndicator } from "@/components/shared/connectivity-indicator";
import { OnboardingWizard } from "@/components/shared/onboarding-wizard";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";
import { useRequireAuth } from "@/hooks/use-auth";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthorized } = useRequireAuth();
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setQuickActionOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <MobileNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ImpersonationBanner />
        <Header onQuickAction={() => setQuickActionOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-background p-4 pb-20 sm:pb-6 sm:p-6">
          {children}
        </main>
        <BottomNav />
      </div>
      <ConnectivityIndicator />
      <QuickActionBar open={quickActionOpen} onOpenChange={setQuickActionOpen} />
      <OnboardingWizard />
    </div>
  );
}
