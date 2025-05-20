import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const baseDomain = process.env.NEXT_PUBLIC_DOMAIN || "theadome.xyz";

  if (hostname !== baseDomain && hostname.endsWith(baseDomain)) {
    const subdomain = hostname.split(`.${baseDomain}`)[0];
    const newPath = `/agency/${subdomain}${url.pathname}`;
    const rewritten = NextResponse.rewrite(new URL(newPath, req.url));
    rewritten.headers.set("x-pathname", url.pathname); 
    return rewritten;
  }

  if (url.pathname === "/login") {
    const stateParam = url.searchParams.get("state");
    if (stateParam && stateParam !== "public") {
      const redirectUrl = `http://${stateParam}.${baseDomain}${url.pathname}?${url.searchParams.toString()}`;
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.headers.set("x-pathname", url.pathname);
      return redirectResponse;
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", url.pathname); 
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};