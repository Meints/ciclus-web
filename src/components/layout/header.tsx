"use client";

import { LogOutIcon, MenuIcon, MoonIcon, SearchIcon, SettingsIcon, SunIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
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
import { NotificationBell } from "@/components/layout/notification-bell";
import { getInitials } from "@/lib/utils";
import { getRoleLabel } from "@/lib/auth";

interface HeaderProps {
  onQuickAction?: () => void;
}

export function Header({ onQuickAction }: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const logoutMutation = useLogout();

  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="flex h-[52px] items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onQuickAction}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
        >
          <SearchIcon className="h-3.5 w-3.5" />
          Ações rápidas...
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-medium">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          className="sm:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          onClick={onQuickAction}
        >
          <SearchIcon className="h-4 w-4" />
        </button>

        <Tooltip content={theme === "dark" ? "Modo claro" : "Modo escuro"}>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            {theme === "dark" ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
        </Tooltip>

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted/60 transition-colors">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-50">
                {user ? getInitials(user.name) : "?"}
              </div>
              <div className="hidden flex-col items-start sm:flex">
                <span className="text-sm font-medium text-foreground leading-tight">{user?.name}</span>
                <span className="text-[11px] text-muted-foreground leading-tight">{user?.companyName}</span>
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
