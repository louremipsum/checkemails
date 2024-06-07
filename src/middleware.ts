import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "@/utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = await createSupabaseReqResClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // protects the "/emails" route and its sub-routes
  if (!user && request.nextUrl.pathname.startsWith("/emails")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/emails/:path*"],
};
