import { NextResponse } from "next/server";
import { contracts, services, customers, employees, generateId, COMPANY_ID, daysFromNow } from "@/mock/seed";
import { getQueryParams, normalize, paginate } from "@/mock/helpers";
import type { Contract } from "@/types/contract";
import type { Service } from "@/types/service";

export async function GET(request: Request) {
  const params = getQueryParams(request);
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "10");
  const search = params.get("search")?.trim();
  const status = params.get("status");
  const serviceType = params.get("serviceType");
  const customerId = params.get("customerId");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  let result = [...contracts];

  if (search) {
    const term = normalize(search);
    result = result.filter((contract) => normalize(contract.customerName).includes(term));
  }
  if (status) result = result.filter((contract) => contract.status === status);
  if (serviceType) result = result.filter((contract) => contract.serviceType === serviceType);
  if (customerId) result = result.filter((contract) => contract.customerId === customerId);
  if (startDate) result = result.filter((contract) => contract.startDate >= startDate);
  if (endDate) result = result.filter((contract) => contract.startDate <= endDate);

  result.sort((a, b) => (a.nextVisitDate ?? "").localeCompare(b.nextVisitDate ?? ""));

  return NextResponse.json(paginate(result, page, pageSize));
}

export async function POST(request: Request) {
  const body = await request.json();
  const customer = customers.find((item) => item.id === body.customerId);
  const employee = employees.find((item) => item.id === body.responsibleEmployeeId);

  const contract: Contract = {
    id: generateId("ctr"),
    companyId: COMPANY_ID,
    customerId: body.customerId,
    customerName: customer?.legalName ?? "Cliente",
    serviceType: body.serviceType,
    frequency: body.frequency,
    startDate: body.startDate,
    nextVisitDate: body.startDate,
    value: Number(body.value),
    responsibleEmployeeId: employee?.id ?? null,
    responsibleEmployeeName: employee?.name ?? null,
    notes: body.notes ?? null,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  contracts.push(contract);

  const firstService: Service = {
    id: generateId("srv"),
    companyId: COMPANY_ID,
    contractId: contract.id,
    customerId: contract.customerId,
    customerName: contract.customerName,
    customerAddress: customer
      ? `${customer.address.street}, ${customer.address.number} - ${customer.address.neighborhood}, ${customer.address.city}/${customer.address.state}`
      : "",
    serviceType: contract.serviceType,
    scheduledDate: contract.startDate || daysFromNow(1),
    employeeId: contract.responsibleEmployeeId,
    employeeName: contract.responsibleEmployeeName,
    status: "SCHEDULED",
    equipment: null,
    equipmentIds: [],
    execution: null,
    reportPdfUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  services.push(firstService);

  return NextResponse.json(contract, { status: 201 });
}
