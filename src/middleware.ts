import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host")?.replace(/^www\./, "") || "";
  const baseDomain = process.env.BASE_DOMAIN || "theadome.xyz";
  const searchParams = url.searchParams.toString();
  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  console.log("Hostname:", hostname);
  console.log("Base Domain:", baseDomain);
  console.log("Path:", pathWithSearchParams);

  // Subdomain detection
  const customSubDomain = hostname
    .split(`.${baseDomain}`)
    .filter(Boolean)[0];

  if (customSubDomain) {
    console.log("Subdomain detected:", customSubDomain);
    const newPath = `/agency/${customSubDomain}${pathWithSearchParams}`;
    console.log("Rewriting to:", newPath);
    return NextResponse.rewrite(new URL(newPath, req.url));
  }

  // Handle /login with state param (your original logic)
  if (url.pathname === "/login") {
    const stateParam = url.searchParams.get("state");
    if (stateParam && stateParam !== "public") {
      const redirectUrl = `http://${stateParam}.${baseDomain}${pathWithSearchParams}`;
      console.log("Redirecting to:", redirectUrl);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      redirectResponse.headers.set("x-pathname", url.pathname);
      return redirectResponse;
    }
  }

  // Handle main domain root path (inspired by sample)
  if (url.pathname === "/" && hostname === baseDomain) {
    console.log("Rewriting root to /site");
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  console.log("Proceeding to next:", pathWithSearchParams);
  const res = NextResponse.next();
  res.headers.set("x-pathname", url.pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/"],
};