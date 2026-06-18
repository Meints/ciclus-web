import { NextResponse } from "next/server";
import { equipment } from "@/mock/seed";
import { errorResponse } from "@/mock/helpers";

interface Params {
  params: Promise<{ id: string; equipmentId: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { id, equipmentId } = await params;
  const index = equipment.findIndex(
    (item) => item.id === equipmentId && item.customerId === id
  );
  const current = equipment[index];
  if (index === -1 || !current) return errorResponse("Equipamento não encontrado.", 404);

  const body = await request.json();

  const updated = {
    ...current,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  equipment[index] = updated;

  return NextResponse.json(updated);
}
