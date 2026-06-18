import { NextResponse } from "next/server";
import { services } from "@/mock/seed";
import { errorResponse } from "@/mock/helpers";
import { createConfirmation } from "@/mock/confirmations";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const index = services.findIndex((service) => service.id === id);
  const current = services[index];
  if (index === -1 || !current) return errorResponse("Ordem de serviço não encontrada.", 404);
  if (current.status !== "COMPLETED") {
    return errorResponse("Apenas ordens de serviço concluídas podem gerar link de confirmação.", 400);
  }

  const confirmation = createConfirmation(id);

  const updated = {
    ...current,
    confirmationStatus: "PENDING" as const,
    confirmationToken: confirmation.token,
    confirmationLink: `/confirmar/${confirmation.token}`,
    confirmationExpiresAt: confirmation.expiresAt,
    confirmedAt: null,
    updatedAt: new Date().toISOString(),
  };

  services[index] = updated;

  return NextResponse.json(updated);
}
