import { NextResponse } from "next/server";
import { services } from "@/mock/seed";
import { errorResponse, withEquipmentDetails } from "@/mock/helpers";
import { createConfirmation } from "@/mock/confirmations";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const index = services.findIndex((service) => service.id === id);
  const current = services[index];
  if (index === -1 || !current) return errorResponse("Ordem de serviço não encontrada.", 404);

  const body = await request.json();
  const completedAt = new Date().toISOString();
  const confirmation = createConfirmation(id);

  const updated = {
    ...current,
    status: "COMPLETED" as const,
    execution: {
      notes: body.notes,
      photoUrls: body.photoUrls ?? [],
      equipmentNotes: body.equipmentNotes ?? [],
      completedAt,
    },
    reportPdfUrl: `/api/services/${id}/report`,
    confirmationStatus: "PENDING" as const,
    confirmationToken: confirmation.token,
    confirmationLink: `/confirmar/${confirmation.token}`,
    confirmationExpiresAt: confirmation.expiresAt,
    confirmedAt: null,
    updatedAt: completedAt,
  };

  services[index] = updated;

  return NextResponse.json(withEquipmentDetails(updated));
}
