import { NextResponse } from "next/server";
import { services, diffInDays } from "@/mock/seed";
import { getQueryParams } from "@/mock/helpers";
import type { UpcomingService } from "@/types/dashboard";

export async function GET(request: Request) {
  const params = getQueryParams(request);
  const start = params.get("start");
  const end = params.get("end");

  const filtered = services.filter((service) => {
    if (start && end) {
      const date = service.scheduledDate.slice(0, 10);
      return date >= start.slice(0, 10) && date <= end.slice(0, 10);
    }
    if (service.status === "CANCELLED") return false;
    const diff = diffInDays(service.scheduledDate);
    return diff >= 0 && diff <= 6;
  });

  const upcoming: UpcomingService[] = filtered
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .map((service) => ({
      id: service.id,
      customerName: service.customerName,
      employeeName: service.employeeName,
      scheduledDate: service.scheduledDate,
      serviceType: service.serviceType,
      status: service.status,
    }));

  return NextResponse.json(upcoming);
}
