import { NextResponse } from "next/server";
import { employees, generateId, COMPANY_ID } from "@/mock/seed";
import { employeesView, getQueryParams, normalize, paginate } from "@/mock/helpers";
import type { Employee } from "@/types/employee";

export async function GET(request: Request) {
  const params = getQueryParams(request);
  const page = Number(params.get("page") ?? "1");
  const pageSize = Number(params.get("pageSize") ?? "10");
  const search = params.get("search")?.trim();

  let result = employeesView();

  if (search) {
    const term = normalize(search);
    result = result.filter((employee) => normalize(employee.name).includes(term));
  }

  return NextResponse.json(paginate(result, page, pageSize));
}

export async function POST(request: Request) {
  const body = await request.json();

  const employee: Employee = {
    id: generateId("emp"),
    companyId: COMPANY_ID,
    name: body.name,
    email: body.email,
    role: body.role,
    phone: body.phone ?? null,
    servicesThisMonth: 0,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };

  employees.push(employee);

  return NextResponse.json(employee, { status: 201 });
}
