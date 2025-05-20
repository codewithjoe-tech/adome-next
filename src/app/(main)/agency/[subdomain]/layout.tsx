import Navbar from '@/components/navbar';
import { AzureProvider } from '@/providers/assure-provider';
import TenantProvider from '@/providers/tenant-provider';
import TenantUserProvider from '@/providers/tenant-user-provider';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const requestHeaders = await headers(); 
    const host = requestHeaders.get("host") || "localhost:3000";
    const subdomain = host.split(".")[0];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenant/${subdomain}/metadata`, {
      cache: "force-cache",
    });

    if (!res.ok) throw new Error("Failed to fetch tenant data");

    const data = await res.json();
    const imageUrl = data.logo ? [{ url: data.logo, width: 1200, height: 630 }] : [];

    return {
      title: data.name || "Elearning",
      description: data.description || "Elearning platform",
      openGraph: {
        title: data.name || "Elearning",
        description: data.description || "An engaging learning experience",
        images: imageUrl,
      },
    };
  } catch (e) {
    console.error("Metadata fetch error:", e);

    return {
      title: "Elearning",
      description: "Elearning platform",
      openGraph: {
        title: "Elearning",
        description: "Elearning platform",
        images: [],
      },
    };
  }
}

const TenantsPage = async ({ children }: { children: React.ReactNode }) => {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-pathname') || '/';

  const shouldShowNavbar = pathname !== '/';

  return (
    <div>


      <TenantProvider>
        <TenantUserProvider>
           <Navbar />
          {children}
        </TenantUserProvider>
      </TenantProvider>
     
    </div>
  );
};


export default TenantsPage;
