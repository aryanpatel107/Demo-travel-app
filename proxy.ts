import { NextResponse, type NextRequest } from "next/server";
import { resolveCurrentHostname } from "@/config";

export function proxy(request: NextRequest) {
  const hostname = resolveCurrentHostname({
    url: request.nextUrl,
    headers: request.headers,
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-hostname", hostname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Clear any legacy sticky cookie so it never interferes with explicit query or host resolution
  if (request.cookies.has("active_brand_hostname")) {
    response.cookies.delete("active_brand_hostname");
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
