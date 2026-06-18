"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
import type { UserRole } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboardIcon;
  roles: UserRole[];
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboardIcon, roles: ["OWNER", "ADMIN"] },
    ],
  },
  {
    label: "Gestão",
    items: [
      { label: "Clientes", href: "/clientes", icon: UsersIcon, roles: ["OWNER", "ADMIN"] },
      { label: "Contratos", href: "/contratos", icon: FileTextIcon, roles: ["OWNER", "ADMIN"] },
      {
        label: "Serviços / OS",
        href: "/servicos",
        icon: ClipboardListIcon,
        roles: ["OWNER", "ADMIN", "TECHNICIAN"],
      },
    ],
  },
  {
    label: "Equipe",
    items: [
      {
        label: "Técnicos",
        href: "/equipe",
        icon: UsersRoundIcon,
        roles: ["OWNER", "ADMIN"],
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <aside
      className={cn(
        "flex h-full w-60 flex-col border-r-[0.5px] border-ciclus-gray-100 bg-white",
        className
      )}
    >
      <div className="flex h-[52px] items-center gap-2 border-b-[0.5px] border-ciclus-gray-100 px-4">
        <RecycleIcon className="h-4 w-4 text-ciclus-blue-600" />
        <span className="text-[15px] font-medium text-ciclus-blue-600">Ciclus</span>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto py-2">
        {NAV_SECTIONS.map((section, index) => {
          const items = section.items.filter((item) => hasRole(user?.role, item.roles));
          if (items.length === 0) return null;

          return (
            <div key={section.label ?? index} className="flex flex-col">
              {section.label && (
                <p className="px-4 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-ciclus-gray-400">
                  {section.label}
                </p>
              )}
              {items.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 border-l-2 border-transparent px-4 py-2 text-[13px] transition-colors",
                      isActive
                        ? "border-ciclus-blue-600 bg-ciclus-blue-50 font-medium text-ciclus-blue-600"
                        : "text-ciclus-gray-600 hover:bg-ciclus-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col border-t-[0.5px] border-ciclus-gray-100">
        <Link
          href="/configuracoes"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 border-l-2 border-transparent px-4 py-2 text-[13px] transition-colors",
            pathname.startsWith("/configuracoes")
              ? "border-ciclus-blue-600 bg-ciclus-blue-50 font-medium text-ciclus-blue-600"
              : "text-ciclus-gray-600 hover:bg-ciclus-gray-50"
          )}
        >
          <SettingsIcon className="h-4 w-4 shrink-0" />
          Configurações
        </Link>
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ciclus-blue-50 text-xs font-medium text-ciclus-blue-600">
            {user ? getInitials(user.name) : "?"}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium text-ciclus-gray-900">
              {user?.name}
            </span>
            <span className="truncate text-[11px] text-ciclus-gray-400">
              {user ? getRoleLabel(user.role) : ""}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
