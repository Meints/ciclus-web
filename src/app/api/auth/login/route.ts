import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { createFakeToken } from "@/mock/tokens";
import { AUTH_USERS, COMPANY_ID, COMPANY_NAME, company } from "@/mock/seed";
import { errorResponse } from "@/mock/helpers";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const account = AUTH_USERS.find((user) => user.email === email);

  if (!account || account.password !== password) {
    return errorResponse("E-mail ou senha inválidos.", 401);
  }

  const token = createFakeToken({
    sub: account.id,
    role: account.role,
    companyId: COMPANY_ID,
  });

  const response = NextResponse.json({
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      companyId: COMPANY_ID,
      companyName: COMPANY_NAME,
      niche: company.niche,
      avatarUrl: null,
    },
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
