import { NextResponse } from "next/server";
import { contracts } from "@/mock/seed";
import { errorResponse, findContract } from "@/mock/helpers";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const contract = findContract(id);
  if (!contract) return errorResponse("Contrato não encontrado.", 404);
  return NextResponse.json(contract);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const index = contracts.findIndex((contract) => contract.id === id);
  const current = contracts[index];
  if (index === -1 || !current) return errorResponse("Contrato não encontrado.", 404);

  const body = await request.json();
  const updated = { ...current, ...body, updatedAt: new Date().toISOString() };
  contracts[index] = updated;

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const index = contracts.findIndex((contract) => contract.id === id);
  if (index === -1) return errorResponse("Contrato não encontrado.", 404);

  contracts.splice(index, 1);

  return new NextResponse(null, { status: 204 });
}
