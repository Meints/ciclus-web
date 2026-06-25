import { BuildingIcon, ExternalLinkIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_VARIANTS } from "@/lib/labels";
import { maskPhone } from "@/lib/document";
import { Tooltip } from "@/components/ui/tooltip";
import { SensitiveData } from "@/components/ui/sensitive-data";
import { customerService } from "@/services/customer.service";
import { useAuthStore } from "@/store/auth.store";
import { hasRole } from "@/lib/auth";
import type { Customer } from "@/types/customer";

function buildMapsUrl(address: Customer["address"]): string {
  const parts = [address.street, address.number, address.neighborhood, address.city, address.state]
    .filter(Boolean)
    .map((s) => encodeURIComponent(s!));
  return `https://www.google.com/maps/search/${parts.join("+")}`;
}

function formatAddress(address: Customer["address"]): string {
  return `${address.street}, ${address.number} - ${address.city}/${address.state}`;
}

export function CustomerCard({ customer }: { customer: Customer }) {
  const user = useAuthStore((state) => state.user);
  const canReveal = hasRole(user?.role, ["OWNER", "ADMIN"]);

  const revealDocument = async () => {
    const data = await customerService.reveal(customer.id);
    return data.document;
  };

  const phoneDigits = customer.phone?.replace(/\D/g, "");

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{customer.legalName}</h2>
            {customer.tradeName && (
              <p className="text-sm text-muted-foreground">{customer.tradeName}</p>
            )}
          </div>
          <StatusBadge
            label={CUSTOMER_STATUS_LABELS[customer.status]}
            variant={CUSTOMER_STATUS_VARIANTS[customer.status]}
          />
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BuildingIcon className="h-4 w-4 shrink-0" />
            <SensitiveData
              masked={customer.document}
              onReveal={revealDocument}
              canReveal={canReveal}
              revealLabel="Exibir documento do cliente"
              hideLabel="Ocultar documento"
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {customer.phone && (
              <Tooltip content="Ligar para o cliente">
                <a
                  href={`tel:+55${phoneDigits}`}
                  className="inline-flex w-fit items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0" />
                  {maskPhone(customer.phone)}
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              </Tooltip>
            )}
            {customer.email && (
              <Tooltip content="Enviar e-mail para o cliente">
                <a
                  href={`mailto:${customer.email}`}
                  className="inline-flex w-fit items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <MailIcon className="h-4 w-4 shrink-0" />
                  {customer.email}
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              </Tooltip>
            )}
            <Tooltip content="Abrir no Google Maps">
              <a
                href={buildMapsUrl(customer.address)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <MapPinIcon className="h-4 w-4 shrink-0" />
                {formatAddress(customer.address)}
                <ExternalLinkIcon className="h-3 w-3 shrink-0" />
              </a>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
