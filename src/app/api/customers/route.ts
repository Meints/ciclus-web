import { NextResponse } from "next/server";
import { customers, generateId, COMPANY_ID } from "@/mock/seed";
import { customersView, getQueryParams, normalize, paginate } from "@/mock/helpers";
import type { Customer } from "@/types/customer";

export async function GET(request: Request) {
  const params = getQueryParams(request);
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "10");
  const search = params.get("search")?.trim();
  const status = params.get("status");

  let result = customersView();

  if (search) {
    const term = normalize(search);
    result = result.filter(
      (customer) =>
        normalize(customer.legalName).includes(term) || customer.document.includes(term.replace(/\D/g, ""))
    );
  }

  if (status) {
    result = result.filter((customer) => customer.status === status);
  }

  return NextResponse.json(paginate(result, page, pageSize));
}

export async function POST(request: Request) {
  const body = await request.json();

  const customer: Customer = {
    id: generateId("cust"),
    companyId: COMPANY_ID,
    legalName: body.legalName,
    tradeName: body.tradeName ?? null,
    documentType: body.documentType,
    document: String(body.document).replace(/\D/g, ""),
    email: body.email ?? null,
    phone: String(body.phone).replace(/\D/g, ""),
    address: body.address,
    status: "ACTIVE",
    contractsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  customers.push(customer);

  return NextResponse.json(customer, { status: 201 });
}
