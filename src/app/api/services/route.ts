import { NextResponse } from "next/server";
import { services, customers, employees, equipment, generateId, COMPANY_ID } from "@/mock/seed";
import { getQueryParams, normalize, paginate, withEquipmentDetails } from "@/mock/helpers";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/labels";
import type { Service } from "@/types/service";

export async function GET(request: Request) {
  const params = getQueryParams(request);
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "10");
  const search = params.get("search")?.trim();
  const status = params.get("status");
  const employeeId = params.get("employeeId");
  const customerId = params.get("customerId");
  const contractId = params.get("contractId");
  const date = params.get("date");

  let result = [...services];

  if (search) {
    const term = normalize(search);
    result = result.filter((service) => normalize(service.customerName).includes(term));
  }
  if (status) result = result.filter((service) => service.status === status);
  if (employeeId) result = result.filter((service) => service.employeeId === employeeId);
  if (customerId) result = result.filter((service) => service.customerId === customerId);
  if (contractId) result = result.filter((service) => service.contractId === contractId);
  if (date) {
    result = result.filter((service) => service.scheduledDate.slice(0, 10) === date);
  }

  result.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const paginated = paginate(result, page, pageSize);

  return NextResponse.json({
    ...paginated,
    data: paginated.data.map(withEquipmentDetails),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const customer = customers.find((item) => item.id === body.customerId);
  const employee = employees.find((item) => item.id === body.employeeId);
  const equipmentIds: string[] = Array.isArray(body.equipmentIds) ? body.equipmentIds : [];
  const selectedEquipment = equipment.filter((item) => equipmentIds.includes(item.id));

  const service: Service = {
    id: generateId("srv"),
    companyId: COMPANY_ID,
    contractId: body.contractId,
    customerId: body.customerId,
    customerName: customer?.legalName ?? "Cliente",
    customerAddress: customer
      ? `${customer.address.street}, ${customer.address.number} - ${customer.address.neighborhood}, ${customer.address.city}/${customer.address.state}`
      : "",
    serviceType: body.serviceType,
    scheduledDate: body.scheduledDate,
    employeeId: employee?.id ?? null,
    employeeName: employee?.name ?? null,
    status: "SCHEDULED",
    equipment:
      selectedEquipment.length > 0
        ? selectedEquipment
            .map((item) => `${EQUIPMENT_TYPE_LABELS[item.type]} - ${item.location}`)
            .join(", ")
        : null,
    equipmentIds,
    execution: null,
    reportPdfUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  services.push(service);

  return NextResponse.json(withEquipmentDetails(service), { status: 201 });
}
