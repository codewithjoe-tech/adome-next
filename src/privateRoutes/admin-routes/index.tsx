"use client"

import LoadingPage from '@/components/global/loading-page'
import { RootState } from '@/Redux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

type Props = {
  children: React.ReactNode
  allowedRoles: string[]
}

const PrivateRoutes = ({ children, allowedRoles }: Props) => {
  const user = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log(user)
    if (user === null) {
      console.log("User state in PrivateRoutes:", user);
      // router.replace('/login')
    } else if (!allowedRoles.includes(user.user.role)) {
      router.replace('/403')
    } else {
      setLoading(false)
    }
  }, [user, router, allowedRoles])

  if (loading) {
    return <LoadingPage />
  }

  return <>{children}</>
}

export default PrivateRoutes
