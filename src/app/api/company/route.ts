import { NextResponse } from "next/server";
import { company } from "@/mock/seed";
import { errorResponse } from "@/mock/helpers";

export async function GET() {
  return NextResponse.json(company);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  if (!body.niche) return errorResponse("Selecione o segmento de atuação.", 400);

  company.niche = body.niche;

  return NextResponse.json(company);
}
