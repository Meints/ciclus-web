import { NextResponse } from "next/server";
import { customers } from "@/mock/seed";
import { errorResponse, findCustomer, withContractsCount } from "@/mock/helpers";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const customer = findCustomer(id);
  if (!customer) return errorResponse("Cliente não encontrado.", 404);

  return NextResponse.json({ ...customer, contractsCount: withContractsCount(customer.id) });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const index = customers.findIndex((customer) => customer.id === id);
  const current = customers[index];
  if (index === -1 || !current) return errorResponse("Cliente não encontrado.", 404);

  const body = await request.json();

  const updated = {
    ...current,
    ...body,
    document: body.document ? String(body.document).replace(/\D/g, "") : current.document,
    phone: body.phone ? String(body.phone).replace(/\D/g, "") : current.phone,
    address: body.address ? { ...current.address, ...body.address } : current.address,
    updatedAt: new Date().toISOString(),
  };

  customers[index] = updated;

  return NextResponse.json({ ...updated, contractsCount: withContractsCount(updated.id) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const index = customers.findIndex((customer) => customer.id === id);
  if (index === -1) return errorResponse("Cliente não encontrado.", 404);

  customers.splice(index, 1);

  return new NextResponse(null, { status: 204 });
}
