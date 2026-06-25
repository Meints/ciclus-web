"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  BuildingIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LogOutIcon,
  RecycleIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRequireAuth, useLogout } from "@/hooks/use-auth";

const NAV = [
  { label: "Visão geral", href: "/admin", icon: LayoutDashboardIcon, exact: true },
  { label: "Empresas", href: "/admin/empresas", icon: BuildingIcon },
  { label: "Financeiro", href: "/admin/financeiro", icon: BarChart3Icon },
  { label: "Em risco", href: "/admin/risco", icon: ShieldAlertIcon },
  { label: "Planos", href: "/admin/planos", icon: CreditCardIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, isAuthorized } = useRequireAuth(["SUPERADMIN"]);
  const logout = useLogout();

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <RecycleIcon className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Ciclus</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <p className="text-xs text-muted-foreground">Logado como</p>
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <button
            onClick={() => logout.mutate()}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOutIcon className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
}
