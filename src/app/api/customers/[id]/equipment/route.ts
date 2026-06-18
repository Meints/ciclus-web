import { NextResponse } from "next/server";
import { equipment, generateId, COMPANY_ID } from "@/mock/seed";
import { errorResponse, findCustomer } from "@/mock/helpers";
import type { Equipment } from "@/types/equipment";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const customer = findCustomer(id);
  if (!customer) return errorResponse("Cliente não encontrado.", 404);

  const data = equipment.filter((item) => item.customerId === id);
  return NextResponse.json({ data });
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const customer = findCustomer(id);
  if (!customer) return errorResponse("Cliente não encontrado.", 404);

  const body = await request.json();
  const now = new Date().toISOString();

  const item: Equipment = {
    id: generateId("equip"),
    companyId: COMPANY_ID,
    customerId: id,
    type: body.type,
    brand: body.brand,
    model: body.model,
    capacity: body.capacity ?? null,
    serialNumber: body.serialNumber ?? null,
    location: body.location,
    installationDate: body.installationDate ?? null,
    notes: body.notes ?? null,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  equipment.push(item);

  return NextResponse.json(item, { status: 201 });
}
