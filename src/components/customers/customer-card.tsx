import { BuildingIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_VARIANTS } from "@/lib/labels";
import { maskDocument, maskPhone } from "@/lib/document";
import type { Customer } from "@/types/customer";

export function CustomerCard({ customer }: { customer: Customer }) {
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
            <BuildingIcon className="h-4 w-4" />
            {maskDocument(customer.document, customer.documentType)}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PhoneIcon className="h-4 w-4" />
            {maskPhone(customer.phone)}
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MailIcon className="h-4 w-4" />
              {customer.email}
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            {customer.address.street}, {customer.address.number} - {customer.address.city}/
            {customer.address.state}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
