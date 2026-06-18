import { NextResponse } from "next/server";
import { contracts, diffInDays } from "@/mock/seed";
import type { ExpiringContract } from "@/types/dashboard";

export async function GET() {
  const expiring: ExpiringContract[] = contracts
    .filter(
      (contract) =>
        contract.status === "ACTIVE" &&
        contract.nextVisitDate &&
        diffInDays(contract.nextVisitDate) >= 0 &&
        diffInDays(contract.nextVisitDate) <= 30
    )
    .sort((a, b) => (a.nextVisitDate ?? "").localeCompare(b.nextVisitDate ?? ""))
    .map((contract) => ({
      id: contract.id,
      customerName: contract.customerName,
      serviceType: contract.serviceType,
      expiresAt: contract.nextVisitDate as string,
      daysRemaining: diffInDays(contract.nextVisitDate as string),
    }));

  return NextResponse.json(expiring);
}
