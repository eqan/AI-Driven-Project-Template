import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_COOKIE = "project_template_auth_token";

function isPublicPathname(pathname: string) {
  return pathname === "/auth";
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicPath = isPublicPathname(pathname);
  const hasToken = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE)?.value);

  if (!hasToken && !publicPath) {
    const loginUrl = new URL("/auth", request.url);
    const nextTarget = `${pathname}${request.nextUrl.search}`;

    if (nextTarget !== "/auth") {
      loginUrl.searchParams.set("next", nextTarget);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
