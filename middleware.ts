import { NextResponse, type NextRequest } from "next/server";
import { DISPLAY_MODE_COOKIE, isStandaloneValue } from "@/lib/display-mode";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isStandalone = isStandaloneValue(req.cookies.get(DISPLAY_MODE_COOKIE)?.value);

  // PWA sessions land on /lab by default; portfolio remains reachable at /site.
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
