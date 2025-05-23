"use client";

import axiosInstance from "@/axios/public-instance";
import LoadingPage from "@/components/global/loading-page";
import { getSubdomain } from "@/constants";
import { setAppInfo } from "@/Redux/slices/app-details";
import { RootState } from "@/Redux/store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const fetchTenant = async () => {
  const response = await axiosInstance.get(`tenant/${getSubdomain()}/metadata`);
  return response.data;
};

const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { tenant = null } = useSelector((state: RootState) => state.app || {});

  // if (tenant?.id) return <>{children}</>;
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: tenantData, isLoading, isError } = useQuery({
    queryKey: ["tenantData" , getSubdomain()],
    queryFn: async ()=>{
      if (tenant?.id) return tenant
      fetchTenant()
    },
    retry: false,
    enabled : !tenant?.id
  });

  useEffect(() => {
    if (tenantData?.logo) {
      console.log(tenantData)
      dispatch(setAppInfo({ tenant : tenantData, schemaName:tenantData.subdomain }));

      // Remove existing favicons properly
      const existingIcons = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']");
      existingIcons.forEach((icon) => icon.parentNode?.removeChild(icon));

      // Create new favicon with cache-busting timestamp
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = `${tenantData.logo}?v=${Date.now()}`;
      newFavicon.type = "image/png";

      document.head.appendChild(newFavicon);
    }
  }, [tenantData, dispatch]);

  if (isLoading) return <LoadingPage />;
  if (isError) {
    router.replace("/404");
    return null;
  }

  return <>{children}</>;
};

export default TenantProvider;
