import { NextResponse } from "next/server";
import { services, employees, equipment } from "@/mock/seed";
import { errorResponse, findService, withEquipmentDetails } from "@/mock/helpers";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/labels";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const service = findService(id);
  if (!service) return errorResponse("Ordem de serviço não encontrada.", 404);
  return NextResponse.json(withEquipmentDetails(service));
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const index = services.findIndex((service) => service.id === id);
  const current = services[index];
  if (index === -1 || !current) return errorResponse("Ordem de serviço não encontrada.", 404);

  const body = await request.json();
  const employee = body.employeeId ? employees.find((item) => item.id === body.employeeId) : undefined;
  const selectedEquipment = Array.isArray(body.equipmentIds)
    ? equipment.filter((item) => body.equipmentIds.includes(item.id))
    : undefined;

  const updated = {
    ...current,
    ...body,
    employeeName: employee ? employee.name : current.employeeName,
    equipment: selectedEquipment
      ? selectedEquipment.length > 0
        ? selectedEquipment
            .map((item) => `${EQUIPMENT_TYPE_LABELS[item.type]} - ${item.location}`)
            .join(", ")
        : null
      : current.equipment,
    updatedAt: new Date().toISOString(),
  };

  services[index] = updated;

  return NextResponse.json(withEquipmentDetails(updated));
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const index = services.findIndex((service) => service.id === id);
  if (index === -1) return errorResponse("Ordem de serviço não encontrada.", 404);

  services.splice(index, 1);

  return new NextResponse(null, { status: 204 });
}
