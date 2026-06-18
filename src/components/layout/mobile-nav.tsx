"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui.store";
import { Sidebar } from "@/components/layout/sidebar";

export function MobileNav() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <DialogPrimitive.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 md:hidden" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 left-0 z-50 h-full w-60 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left md:hidden"
          )}
        >
          <DialogPrimitive.Title className="sr-only">Menu de navegação</DialogPrimitive.Title>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
