import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Builds a tenant URL from the current host so it works on both
// localhost (subdomain.localhost:3000) and production (subdomain.theadome.xyz).
// Only call from the base domain (client side).
export function tenantUrl(subdomain: string, path: string = "/") {
  const host = window.location.host.replace(/^www\./, "")
  return `${window.location.protocol}//${subdomain}.${host}${path}`
}
