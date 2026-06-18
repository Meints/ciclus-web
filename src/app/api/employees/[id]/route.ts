import { NextResponse } from "next/server";
import { employees } from "@/mock/seed";
import { employeesView, errorResponse } from "@/mock/helpers";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const employee = employeesView().find((item) => item.id === id);
  if (!employee) return errorResponse("Colaborador não encontrado.", 404);
  return NextResponse.json(employee);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const index = employees.findIndex((employee) => employee.id === id);
  const current = employees[index];
  if (index === -1 || !current) return errorResponse("Colaborador não encontrado.", 404);

  const body = await request.json();
  const updated = { ...current, ...body };
  employees[index] = updated;

  return NextResponse.json(updated);
}
