"use client";

import { useEffect, useState } from "react";
import { CopyIcon, MessageCircleIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

interface ConfirmationLinkPanelProps {
  confirmationLink: string;
  expiresAt: string | null;
  customerPhone?: string | null;
}

export function ConfirmationLinkPanel({ confirmationLink, expiresAt, customerPhone }: ConfirmationLinkPanelProps) {
  const [absoluteUrl, setAbsoluteUrl] = useState(confirmationLink);

  useEffect(() => {
    setAbsoluteUrl(`${window.location.origin}${confirmationLink}`);
  }, [confirmationLink]);

  function handleCopy() {
    navigator.clipboard.writeText(absoluteUrl);
  }

  function handleWhatsApp() {
    const message = encodeURIComponent(
      `Olá! Para confirmar a realização do serviço, acesse o link abaixo:\n\n${absoluteUrl}\n\nAtenciosamente.`,
    );
    const phone = customerPhone ? onlyDigits(customerPhone) : "";
    const url = phone
      ? `https://wa.me/55${phone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-md border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">
        Mostre o QR code abaixo para o cliente confirmar o serviço pelo celular.
      </p>
      <div className="rounded-md border bg-card p-3">
        <QRCodeSVG value={absoluteUrl} size={200} />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2">
        <p className="text-sm text-muted-foreground">Compartilhe o link:</p>
        <div className="flex items-center gap-2">
          <Input readOnly value={absoluteUrl} className="text-xs" />
          <Button type="button" variant="outline" size="icon" onClick={handleCopy} title="Copiar link">
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handleWhatsApp}
        >
          <MessageCircleIcon className="h-4 w-4 text-[#25D366]" />
          Enviar por WhatsApp
        </Button>
      </div>

      {expiresAt && (
        <p className="text-xs text-muted-foreground">
          Link válido até {formatDateTime(expiresAt)} (24 horas após a geração).
        </p>
      )}
    </div>
  );
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}
