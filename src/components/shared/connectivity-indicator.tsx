"use client";

import { useEffect, useState } from "react";
import { WifiIcon, WifiOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConnectivityIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    }
    function handleOffline() {
      setIsOnline(false);
      setShow(true);
    }

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-xs font-medium shadow-lg transition-all",
        isOnline
          ? "bg-success-600 text-white"
          : "bg-danger-500 text-white",
      )}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <WifiIcon className="h-3.5 w-3.5" />
            Conexão restabelecida
          </>
        ) : (
          <>
            <WifiOffIcon className="h-3.5 w-3.5" />
            Modo off-line — dados serão sincronizados quando houver conexão
          </>
        )}
      </div>
    </div>
  );
}
