"use client";

import { useEffect, useState } from "react";
import { CopyIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

interface ConfirmationLinkPanelProps {
  confirmationLink: string;
  expiresAt: string | null;
}

export function ConfirmationLinkPanel({ confirmationLink, expiresAt }: ConfirmationLinkPanelProps) {
  const [absoluteUrl, setAbsoluteUrl] = useState(confirmationLink);

  useEffect(() => {
    setAbsoluteUrl(`${window.location.origin}${confirmationLink}`);
  }, [confirmationLink]);

  function handleCopy() {
    navigator.clipboard.writeText(absoluteUrl);
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-md border bg-white p-6 text-center">
      <p className="text-sm text-muted-foreground">
        Mostre o QR code abaixo para o cliente confirmar o serviço pelo celular.
      </p>
      <div className="rounded-md border bg-white p-3">
        <QRCodeSVG value={absoluteUrl} size={200} />
      </div>
      <p className="text-sm text-muted-foreground">Ou compartilhe o link:</p>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input readOnly value={absoluteUrl} className="text-xs" />
        <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
          <CopyIcon />
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
