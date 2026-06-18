import { NextResponse } from "next/server";
import { contracts, customers, services, diffInDays } from "@/mock/seed";

export async function GET() {
  const now = new Date();

  const activeCustomers = customers.filter((customer) => customer.status === "ACTIVE").length;
  const activeContracts = contracts.filter((contract) => contract.status === "ACTIVE").length;

  const servicesThisMonth = services.filter((service) => {
    const date = new Date(service.scheduledDate);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const contractsExpiringIn30Days = contracts.filter(
    (contract) =>
      contract.status === "ACTIVE" &&
      contract.nextVisitDate &&
      diffInDays(contract.nextVisitDate) >= 0 &&
      diffInDays(contract.nextVisitDate) <= 30
  ).length;

  return NextResponse.json({
    activeCustomers,
    activeContracts,
    servicesThisMonth,
    contractsExpiringIn30Days,
  });
}
