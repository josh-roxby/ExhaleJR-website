import { NextResponse, type NextRequest } from "next/server";
import { DISPLAY_MODE_COOKIE, isStandaloneValue } from "@/lib/display-mode";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isStandalone = isStandaloneValue(req.cookies.get(DISPLAY_MODE_COOKIE)?.value);

  // PWA (standalone) sessions land on /lab by default. Portfolio is still
  // reachable at all the other routes; only the root rewrite changes.
  if (isStandalone && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/lab";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
