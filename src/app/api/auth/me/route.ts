import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { decodeFakeToken } from "@/mock/tokens";
import { AUTH_USERS, COMPANY_NAME, company } from "@/mock/seed";
import { errorResponse } from "@/mock/helpers";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  const token = match?.slice(AUTH_COOKIE_NAME.length + 1);
  const payload = token ? decodeFakeToken(token) : null;

  if (!payload || payload.exp * 1000 < Date.now()) {
    return errorResponse("Sessão expirada. Faça login novamente.", 401);
  }

  const account = AUTH_USERS.find((user) => user.id === payload.sub);
  if (!account) {
    return errorResponse("Usuário não encontrado.", 401);
  }

  return NextResponse.json({
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    companyId: payload.companyId,
    companyName: COMPANY_NAME,
    niche: company.niche,
    avatarUrl: null,
  });
}
