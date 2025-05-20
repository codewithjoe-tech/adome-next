"use client";

import axiosInstance from "@/axios/public-instance";
import LoadingPage from "@/components/global/loading-page";
import { getSubdomain } from "@/constants";
import { setUserData } from "@/Redux/slices/user-details";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCookie } from "typescript-cookie";

type Props = {
  children: React.ReactNode;
};

const fetchTenantUser = async () => {
try{

  const response = await axiosInstance.get(`user/${getSubdomain()}/tenantuser`);
  console.log(response)
  if(response.data){
    return response.data;
  }else{
    console.log(response)
    throw new Error('Unable to fetch tenant user')
  }
}catch(err:any){
  throw Error(err)
}
  
};

const TenantUserProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { data, isLoading, isError,  } = useQuery({
    queryKey: ["tenantUser"],
    queryFn: fetchTenantUser,
    retry: false,
  });
  const router = useRouter()
  useEffect(() => {
    console.log(data)
    
    if (!isLoading && !isError && data) {
      dispatch(setUserData({ user: data, role:data.role,  isLoggedIn: true }));
      console.log(data , data.role)
      setCookie('user_email',data.user.email)
    } else if (!isLoading && isError) {
      // console.log(data)
      // dispatch(setUserData({ user: null, isLoggedIn: false }));
    }
    if(data?.blocked){
      router.push('/404')
      
    }
  }, [data, isLoading, isError, dispatch]);
  

  return <>{
    isLoading? <LoadingPage /> : children
  }</>;
};

export default TenantUserProvider;
