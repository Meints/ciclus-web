import { NextResponse } from "next/server";
import { services, COMPANY_NAME } from "@/mock/seed";
import {
  confirmByToken,
  findConfirmation,
  isConfirmationExpired,
} from "@/mock/confirmations";
import { getServiceTypeLabel } from "@/lib/service-types";
import type { ConfirmationSummary } from "@/types/confirmation";

interface Params {
  params: Promise<{ token: string }>;
}

function buildSummary(token: string): ConfirmationSummary {
  const record = findConfirmation(token);

  if (!record) {
    return {
      status: "NOT_FOUND",
      serviceId: null,
      companyName: null,
      serviceTypeLabel: null,
      customerName: null,
      technicianName: null,
      completedAt: null,
      confirmedAt: null,
    };
  }

  const service = services.find((item) => item.id === record.serviceId);

  if (!service) {
    return {
      status: "NOT_FOUND",
      serviceId: null,
      companyName: null,
      serviceTypeLabel: null,
      customerName: null,
      technicianName: null,
      completedAt: null,
      confirmedAt: null,
    };
  }

  const status = record.confirmedAt
    ? "CONFIRMED"
    : isConfirmationExpired(record)
      ? "EXPIRED"
      : "PENDING";

  return {
    status,
    serviceId: service.id,
    companyName: COMPANY_NAME,
    serviceTypeLabel: getServiceTypeLabel(service.serviceType),
    customerName: service.customerName,
    technicianName: service.employeeName,
    completedAt: service.execution?.completedAt ?? null,
    confirmedAt: record.confirmedAt,
  };
}

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  return NextResponse.json(buildSummary(token));
}

export async function POST(_request: Request, { params }: Params) {
  const { token } = await params;
  const record = findConfirmation(token);

  if (record && !record.confirmedAt && !isConfirmationExpired(record)) {
    confirmByToken(token);
    const service = services.find((item) => item.id === record.serviceId);
    if (service) {
      service.confirmationStatus = "CONFIRMED";
      service.confirmedAt = record.confirmedAt;
      service.updatedAt = new Date().toISOString();
    }
  }

  return NextResponse.json(buildSummary(token));
}
