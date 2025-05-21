"use client"

import { Spinner } from '@/app/components/ui/spinner'
import axiosInstance from '@/axios/public-instance'
import { useToast } from '@/hooks/use-toast'
import { RootState } from '@/Redux/store'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import BackdropGradient from '@/components/global/backdrop-gradiant'
import { GoogleAuthButton } from '@/components/global/google-auth-button'
import { getCookie, setCookie } from 'typescript-cookie'

type Props = {}


// const getSubdomain = (): string => {
//   if (typeof window !== "undefined") {
//       const hostname = window.location.hostname; 
//       const parts = hostname.split(".");

//       if (hostname.includes("localhost")) {
//           if (parts.length > 2) {
//               return parts[0]; // Extract first part before "localhost"
//           }
//           return "public"; // Default subdomain
//       }

//       // Handle production domains (e.g., sub.domain.com)
//       if (parts.length > 2) {
//           return parts[0]; // Extract subdomain
//       }
//   }
//   return "public"; 
// };

  
const Page = (props: Props) => {
    
  const searchParams = useSearchParams()
  const stateParam = searchParams.get('state')
  const code = searchParams.get('code')
  const scope = searchParams.get('scope')
  const authUser = searchParams.get("authuser")
  const { toast } = useToast()
  const router = useRouter()
  const {schemaName} = useSelector((state:RootState)=>state.app)
 const queryClient = useQueryClient()
  
//   const {schemaName} = useSelector((state: RootState) => state.app)
// const schemaName = getSubdomain()
//   console.log(schemaName)

  const fetchAuth = async () => {
    if (!code) return 
  try{
    if (!code || !scope || !stateParam || !authUser) {
        throw new Error("Missing parameters")
      }
      const response = await axiosInstance.post(`user/${schemaName}/login`, {
        code,
        scope,
        state: stateParam,
        authUser
      })
      console.log(response.data)
      if (!response.data.app) {
        console.log("No app found")
      }
      if (response.status === 200) {

        const data= response.data
        // const refresh_token:string = data.refresh
        // const access_token:string = data.access
        const expiry = data.expiry
        // setCookie(`${schemaName}_refresh_token`, refresh_token)
        // // setCookie('access_token', access_token)
        // setCookie(`${schemaName}_access_token`, access_token)
        setCookie(`${schemaName}_expiry`, expiry)
        toast({
          title : "Success",
          description : "Logged in successfully",
          variant : "default"
        })
        router.push("/")
        queryClient.invalidateQueries({
          queryKey : ['tenantUser']
        })

      }


      return response.data
  }catch (error:any) {
    toast({
        title: 'Error',
        description: error.message || 'Authentication failed',
        variant: 'destructive'
      })
      console.log(error)
      return error
  }
  }

  useEffect(() => {
    if (!code) return;
    
    // Prevent execution in React Strict Mode
    let isMounted = true;
  
    const authenticate = async () => {
      if (getCookie(`${schemaName}_expiry`)) {
        router.push("/");
        return;
      }
      const data = await fetchAuth();
    };
  
    if (isMounted) {
      authenticate();
    }
  
    return () => {
      isMounted = false;
    };
  }, [code]);
  
  

//   useQuery({
//     queryKey: ['login', code, scope, stateParam, authUser],
//     queryFn: fetchAuth,
//     staleTime: 10000,
//     enabled: isLoggedIn === false ,
  
//     retry:false
//   })

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <BackdropGradient className=' pt-20 flex  justify-center items-center gap-3'>
        {
            code ? (

                <Spinner size="large" />
            ) : (
              <div className='flex items-center  justify-center'>

                <GoogleAuthButton />
              </div>
            )
        }
      {/* <TenantCreateModal open={true} subdomain={subdomain} /> */}
</BackdropGradient>
    </div>
  )
}

export default Page
