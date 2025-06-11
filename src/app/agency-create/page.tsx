"use client"

import BackdropGradient from '@/components/global/backdrop-gradiant'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../components/ui/spinner'
import TenantCreateModal from '../(auth)/auth/callback/_components/TenantModal'

type Props = {}

const Page = (props: Props) => {
    const searchParams = useSearchParams()
    const [subdomain, setSubdomain] = useState<string | null>(null)
    const app = searchParams.get('app')
    const router= useRouter()
    if (!app) {
        toast.error("Improper access",{
            description : "Try again after sometimes"
        })
        router.replace('/')
    }
    useEffect(() => {
    if (app!=='public') setSubdomain(app)
    }, [app])
    
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <BackdropGradient className="pt-20 flex flex-col items-center gap-3">
        <Spinner size="large" />
       { <TenantCreateModal open={true} subdomain={subdomain}  setSubdomain={setSubdomain}/>}
      </BackdropGradient>
    </div>
  )
}

export default Page