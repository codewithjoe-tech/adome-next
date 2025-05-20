// "use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/react-query/provider";
import ReduxProvider from "@/Redux/provider";
import { Toaster } from "@/app/components/ui/toaster";
import LoginCheck from "@/providers/login-check";
import withProgress from "@/providers/progressbar-provider";
import ProgressBarProvider from "@/providers/progressbar-provider";
import { Toaster as Sonner } from "@/components/ui/sonner"
import { ThemeProvider } from "@/theme";
import Assure from "@/components/global/Assure";
import { AzureProvider } from "@/providers/assure-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adome",
  description: "Empower your business with our microservice-based SaaS platform that lets users build custom Learning Management Systems. Leverage isolated multi-tenant databases with Django-tenants, seamless Razorpay integration for flexible plans (Pro, Premium, Luxury), and event-driven microservices for courses, user management, and chat—while a centralized admin dashboard tracks all resources via subdomain routing",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
              <AzureProvider>

        
        <ReduxProvider>
          
          <ReactQueryProvider>
    <LoginCheck>

    <ProgressBarProvider>
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

        {children}
          </ThemeProvider>
    </ProgressBarProvider>
    </LoginCheck>
          </ReactQueryProvider>
        </ReduxProvider>
        <Sonner  />
        <Toaster />
        <Assure />
            </AzureProvider>

      </body>
    </html>
  );
}
