"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardListIcon,
  HomeIcon,
  PlusCircleIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { hasRole } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: typeof HomeIcon;
  roles: UserRole[];
  primary?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/", icon: HomeIcon, roles: ["OWNER", "ADMIN", "TECHNICIAN"] },
  { label: "Serviços", href: "/servicos", icon: ClipboardListIcon, roles: ["OWNER", "ADMIN", "TECHNICIAN"] },
  { label: "Criar", href: "/servicos?quickCreate=true", icon: PlusCircleIcon, roles: ["OWNER", "ADMIN"], primary: true },
  { label: "Clientes", href: "/clientes", icon: UsersIcon, roles: ["OWNER", "ADMIN"] },
];

export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const items = NAV_ITEMS.filter((item) => hasRole(user?.role, item.roles));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card px-2 pb-safe md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-0 tap-target",
              item.primary
                ? "relative -top-3"
                : "",
            )}
          >
            {item.primary ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
                <Icon className="h-6 w-6" />
              </div>
            ) : (
              <>
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-brand-600" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive ? "text-brand-600" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
