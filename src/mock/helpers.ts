import { NextResponse } from "next/server";
import type { PaginatedResponse } from "@/types/api";
import type { Service } from "@/types/service";
import { customers, contracts, services, employees, equipment, COMPANY_ID } from "./seed";

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    data,
    meta: { page: safePage, pageSize, total, totalPages },
  };
}

export function getQueryParams(request: Request) {
  const url = new URL(request.url);
  return url.searchParams;
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { statusCode: status, error: status === 401 ? "Unauthorized" : "Bad Request", message },
    { status }
  );
}

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

export function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(DIACRITICS_PATTERN, "");
}

export function withContractsCount(customerId: string): number {
  return contracts.filter((contract) => contract.customerId === customerId).length;
}

export function customersView() {
  return customers.map((customer) => ({
    ...customer,
    contractsCount: withContractsCount(customer.id),
  }));
}

export function employeesView() {
  const now = new Date();
  return employees.map((employee) => {
    const servicesThisMonth = services.filter((service) => {
      if (service.employeeId !== employee.id) return false;
      const date = new Date(service.scheduledDate);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    return { ...employee, servicesThisMonth };
  });
}

export function findCustomer(id: string) {
  return customers.find((customer) => customer.id === id);
}

export function findContract(id: string) {
  return contracts.find((contract) => contract.id === id);
}

export function findService(id: string) {
  return services.find((service) => service.id === id);
}

export function findEmployee(id: string) {
  return employees.find((employee) => employee.id === id);
}

export function customerEquipment(customerId: string) {
  return equipment.filter((item) => item.customerId === customerId);
}

export function findEquipment(id: string) {
  return equipment.find((item) => item.id === id);
}

export function withEquipmentDetails(service: Service): Service {
  return {
    ...service,
    equipmentDetails: service.equipmentIds
      .map((id) => findEquipment(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
  };
}

export { COMPANY_ID };
