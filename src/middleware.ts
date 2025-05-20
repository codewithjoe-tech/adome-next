import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host")?.replace(/^www\./, "") || "";
  const baseDomain = process.env.BASE_DOMAIN || "localhost:3000";

  console.log("Hostname:", hostname);
  console.log("Base Domain:", baseDomain);
  console.log("Pathname:", url.pathname);

  if (hostname !== baseDomain && hostname.endsWith(baseDomain)) {
    const subdomain = hostname.split(`.${baseDomain}`)[0];
    if (subdomain && subdomain !== "www") {
      const newPath = `/agency/${subdomain}${url.pathname}`;
      console.log("Rewriting to:", newPath);
      const rewritten = NextResponse.rewrite(new URL(newPath, req.url));
      rewritten.headers.set("x-pathname", url.pathname);
      return rewritten;
    }
  }

  if (url.pathname === "/login") {
    const stateParam = url.searchParams.get("state");
    if (stateParam && stateParam !== "public") {
      const redirectUrl = `http://${stateParam}.${baseDomain}${url.pathname}?${url.searchParams.toString()}`;
      console.log("Redirecting to:", redirectUrl);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.headers.set("x-pathname", url.pathname);
      return redirectResponse;
    }
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", url.pathname);
  console.log("Proceeding to next:", url.pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};