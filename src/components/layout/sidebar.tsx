"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  ClipboardListIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  RecycleIcon,
  SettingsIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { hasRole, getRoleLabel } from "@/lib/auth";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import type { UserRole } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboardIcon;
  roles: UserRole[];
  badge?: "warning" | "danger" | "info";
  badgeCount?: number;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { data: summary } = useDashboardSummary();

  const delayedCount = summary?.delayedServices ?? 0;
  const expiringCount = summary?.contractsExpiringIn30Days ?? 0;

  const NAV_SECTIONS: NavSection[] = [
    {
      items: [
        { label: "Dashboard", href: "/", icon: LayoutDashboardIcon, roles: ["OWNER", "ADMIN"] },
        { label: "Relatórios", href: "/relatorios", icon: BarChart3Icon, roles: ["OWNER", "ADMIN"] },
      ],
    },
    {
      label: "Gestão",
      items: [
        { label: "Clientes", href: "/clientes", icon: UsersIcon, roles: ["OWNER", "ADMIN"] },
        {
          label: "Contratos",
          href: "/contratos",
          icon: FileTextIcon,
          roles: ["OWNER", "ADMIN"],
          badge: expiringCount > 0 ? "warning" : undefined,
          badgeCount: expiringCount > 0 ? expiringCount : undefined,
        },
        {
          label: "Serviços / OS",
          href: "/servicos",
          icon: ClipboardListIcon,
          roles: ["OWNER", "ADMIN", "TECHNICIAN"],
          badge: delayedCount > 0 ? "danger" : undefined,
          badgeCount: delayedCount > 0 ? delayedCount : undefined,
        },
      ],
    },
    {
      label: "Equipe",
      items: [
        { label: "Técnicos", href: "/equipe", icon: UsersRoundIcon, roles: ["OWNER", "ADMIN"] },
      ],
    },
  ];

  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => hasRole(user?.role, item.roles)),
  })).filter((s) => s.items.length > 0);

  const badgeVariants = {
    warning: "bg-warning-500 text-white",
    danger: "bg-danger-500 text-white",
    info: "bg-brand-500 text-white",
  };

  return (
    <aside
      className={cn(
        "flex h-full w-60 flex-col border-r border-border bg-card",
        className,
      )}
    >
      <div className="flex h-[52px] items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
          <RecycleIcon className="h-4 w-4" />
        </div>
        <span className="text-[15px] font-semibold text-foreground tracking-tight">Ciclus</span>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto py-2">
        {sections.map((section, index) => (
          <div key={section.label ?? index} className="flex flex-col">
            {section.label && (
              <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group mx-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-muted-foreground dark:hover:bg-accent dark:hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && item.badgeCount != null && item.badgeCount > 0 && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium",
                        badgeVariants[item.badge],
                      )}
                    >
                      {item.badgeCount > 99 ? "99+" : item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-col border-t border-border">
        <Link
          href="/configuracoes"
          onClick={onNavigate}
          className={cn(
            "mx-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
            pathname.startsWith("/configuracoes")
              ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-50"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-muted-foreground dark:hover:bg-accent dark:hover:text-foreground",
          )}
        >
          <SettingsIcon className="h-4 w-4 shrink-0" />
          Configurações
        </Link>
        <div className="mx-2 mb-2 flex items-center gap-2.5 rounded-md bg-muted/60 px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-50">
            {user ? getInitials(user.name) : "?"}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {user?.name}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {user ? getRoleLabel(user.role) : ""}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
