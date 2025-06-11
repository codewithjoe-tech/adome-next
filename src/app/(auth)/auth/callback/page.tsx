"use client"

import { Spinner } from '@/app/components/ui/spinner'
import axiosInstance from '@/axios/public-instance'
import { useToast } from '@/hooks/use-toast'
import { RootState } from '@/Redux/store'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TenantCreateModal from './_components/TenantModal'
import BackdropGradient from '@/components/global/backdrop-gradiant'

const Page = () => {
  const searchParams = useSearchParams()
  const stateParam = searchParams.get('state')
  const code = searchParams.get('code')
  const scope = searchParams.get('scope')
  const authUser = searchParams.get("authuser")
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const { toast } = useToast()
  // const [subdomain, setSubdomain] = useState<string | null>(null)
  const { schemaName } = useSelector((state: RootState) => state.app)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchAuth = async () => {
      // console.log('calling fetchAuth')

    if (stateParam !== "public") return;

    try {
      if (!code || !scope || !stateParam || !authUser) {
        throw new Error("Missing parameters");
      }
      // console.log(schemaName)
      const response = await axiosInstance.post(`user/${schemaName}/login`, {
        code,
        scope,
        state: stateParam,
        authUser
      });

      const {app} = response.data

      router.replace(`/agency-create?app=${app}`);
      // if (response.data.app && response.data.app !== "public") {
      //   // setSubdomain(response.data.app);
      // }
      console.log(response)
      setLoading(false);
      return response.data;
    } catch (error: any) {
      router.replace('/')
      console.log(error)
      toast({
        title: 'Error',
        description: error.message  || 'Authentication failed',
        variant: 'destructive'
      });
      return error;
    } 
  };

  // useQuery({
  //   queryKey: ['login', code, scope, stateParam, authUser],
  //   queryFn: fetchAuth,
  //   staleTime: 10000,
  //   enabled: isLoggedIn === false,
  //   retry: false
  // });


  useEffect(() => {
    if (stateParam && stateParam !== "public" && typeof window !== 'undefined') {
      const url = new URL(`http://${stateParam}.theadome.xyz/login`);
      url.search = searchParams.toString();
      window.location.href = url.toString();
    }else{
    fetchAuth()

    }
  }, [stateParam]); 


  return (
    <div className="h-screen w-full flex items-center justify-center">
      <BackdropGradient className="pt-20 flex flex-col items-center gap-3">
        <Spinner size="large" />
       {/* { !loading && <TenantCreateModal open={true} subdomain={subdomain} setSubdomain={setSubdomain} />} */}
      </BackdropGradient>
    </div>
  );
};

export default Page;
