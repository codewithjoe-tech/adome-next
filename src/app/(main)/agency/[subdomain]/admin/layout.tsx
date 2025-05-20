"use client"

import { usePathname } from "next/navigation"
import BlurPage from '@/components/backgrou-blur'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/global/sidebar'
import PrivateRoutes from '@/privateRoutes/admin-routes'
import TenantAdminLoginCheck from '@/providers/tenant-admin-login-provider'
import React from 'react'

const TenantsAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const isWebsiteBuilder = pathname.startsWith("/admin/builder/")
  const isBlogEditor = pathname.startsWith('/admin/blog/')


  return (
    <TenantAdminLoginCheck>
      <PrivateRoutes allowedRoles={['staff', 'admin']}>
        <div className='h-screen overflow-auto'>

          {!(isWebsiteBuilder || isBlogEditor) && <Sidebar />}
          
          <div className={`${(isWebsiteBuilder || isBlogEditor) ? 'w-full' : "md:pl-[300px]"}`}>

            {!(isWebsiteBuilder || isBlogEditor) && <InfoBar />}

            <div className="relative  bg-transparent">
              {(isWebsiteBuilder || isBlogEditor) ? children : <BlurPage>{children}</BlurPage>}
            </div>
          </div>

        </div>
      </PrivateRoutes>
    </TenantAdminLoginCheck>
  )
}

export default TenantsAdminLayout
