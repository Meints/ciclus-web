"use client";

import { BellIcon, LogOutIcon, MenuIcon, MoonIcon, SearchIcon, SettingsIcon, SunIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useUiStore } from "@/store/ui.store";
import { useLogout } from "@/hooks/use-auth";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { getInitials } from "@/lib/utils";
import { getRoleLabel } from "@/lib/auth";

const PAGE_TITLES: { prefix: string; title: string }[] = [
  { prefix: "/clientes", title: "Clientes" },
  { prefix: "/contratos", title: "Contratos" },
  { prefix: "/servicos", title: "Serviços" },
  { prefix: "/equipe", title: "Equipe" },
  { prefix: "/configuracoes", title: "Configurações" },
  { prefix: "/", title: "Dashboard" },
];

function getPageTitle(pathname: string): string {
  const match = PAGE_TITLES.find((entry) =>
    entry.prefix === "/" ? pathname === "/" : pathname.startsWith(entry.prefix),
  );
  return match?.title ?? "";
}

interface HeaderProps {
  onQuickAction?: () => void;
}

export function Header({ onQuickAction }: HeaderProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const logoutMutation = useLogout();
  const { data: summary } = useDashboardSummary();

  const notificationCount = summary?.contractsExpiringIn30Days ?? 0;
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="flex h-[52px] items-center justify-between border-b-[0.5px] border-ciclus-gray-100 bg-white px-4 sm:px-6 dark:border-border dark:bg-background">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
        <span className="text-[16px] font-medium text-ciclus-gray-900 dark:text-foreground">
          {getPageTitle(pathname)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onQuickAction}
          className="hidden sm:flex items-center gap-2 rounded-md border border-ciclus-gray-100 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          <SearchIcon className="h-3.5 w-3.5" />
          Ações rápidas...
          <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px] font-medium">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-md text-ciclus-gray-600 transition-colors hover:bg-ciclus-gray-50 dark:text-muted-foreground dark:hover:bg-accent"
            onClick={onQuickAction}
        >
          <SearchIcon className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-ciclus-gray-600 transition-colors hover:bg-ciclus-gray-50 dark:text-muted-foreground dark:hover:bg-accent"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-ciclus-gray-600 transition-colors hover:bg-ciclus-gray-50 dark:text-muted-foreground dark:hover:bg-accent"
          >
          <BellIcon className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-medium text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-ciclus-gray-50 dark:hover:bg-accent">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-medium text-brand-600 dark:bg-brand-950">
                {user ? getInitials(user.name) : "?"}
              </div>
              <div className="hidden flex-col items-start sm:flex">
                <span className="text-[13px] font-medium text-ciclus-gray-900 dark:text-foreground">{user?.name}</span>
                <span className="text-[11px] text-ciclus-gray-400 dark:text-muted-foreground">{user?.companyName}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user ? getRoleLabel(user.role) : ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">
                <SettingsIcon className="h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <UserIcon className="h-4 w-4" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOutIcon className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
