import { BuildingIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_VARIANTS } from "@/lib/labels";
import { maskPhone } from "@/lib/document";
import { maskDocumentPrivacy, maskEmailPrivacy } from "@/lib/privacy-mask";
import { SensitiveData } from "@/components/ui/sensitive-data";
import { customerService } from "@/services/customer.service";
import { useAuthStore } from "@/store/auth.store";
import { hasRole } from "@/lib/auth";
import type { Customer } from "@/types/customer";

export function CustomerCard({ customer }: { customer: Customer }) {
  const user = useAuthStore((state) => state.user);
  const canReveal = hasRole(user?.role, ["OWNER", "ADMIN"]);

  const revealDocument = async () => {
    const data = await customerService.reveal(customer.id);
    return data.document;
  };

  const revealEmail = async () => {
    const data = await customerService.reveal(customer.id);
    return data.email;
  };

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

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BuildingIcon className="h-4 w-4 shrink-0" />
            <SensitiveData
              masked={maskDocumentPrivacy(customer.document, customer.documentType)}
              onReveal={revealDocument}
              canReveal={canReveal}
            />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PhoneIcon className="h-4 w-4 shrink-0" />
            {maskPhone(customer.phone)}
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MailIcon className="h-4 w-4 shrink-0" />
              <SensitiveData
                masked={maskEmailPrivacy(customer.email)}
                onReveal={revealEmail}
                canReveal={canReveal}
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="h-4 w-4 shrink-0" />
            {customer.address.street}, {customer.address.number} - {customer.address.city}/
            {customer.address.state}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
