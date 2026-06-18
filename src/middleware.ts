import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

const PUBLIC_ROUTES = ["/login"];
const ALWAYS_PUBLIC_ROUTES = ["/confirmar"];

const EXACT_ROUTE_ROLES: Record<string, UserRole[]> = {
  "/": ["OWNER", "ADMIN"],
};

const PREFIX_ROUTE_ROLES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/configuracoes", roles: ["OWNER"] },
  { prefix: "/clientes", roles: ["OWNER", "ADMIN"] },
  { prefix: "/contratos", roles: ["OWNER", "ADMIN"] },
  { prefix: "/equipe", roles: ["OWNER", "ADMIN"] },
];

interface JwtPayload {
  role?: UserRole;
  companyId?: string;
  sub?: string;
  exp?: number;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function getDefaultRouteForRole(role: UserRole): string {
  return role === "TECHNICIAN" ? "/servicos" : "/";
}

function getRequiredRoles(pathname: string): UserRole[] | null {
  if (EXACT_ROUTE_ROLES[pathname]) {
    return EXACT_ROUTE_ROLES[pathname];
  }
  const match = PREFIX_ROUTE_ROLES.find((route) =>
    pathname.startsWith(route.prefix)
  );
  return match ? match.roles : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isAlwaysPublicRoute = ALWAYS_PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  if (isAlwaysPublicRoute) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    if (token) {
      const payload = decodeJwtPayload(token);
      const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false;
      if (payload?.role && !isExpired) {
        return NextResponse.redirect(
          new URL(getDefaultRouteForRole(payload.role), request.url)
        );
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwtPayload(token);
  const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : true;

  if (!payload?.role || isExpired) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles && !requiredRoles.includes(payload.role)) {
    return NextResponse.redirect(
      new URL(getDefaultRouteForRole(payload.role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
