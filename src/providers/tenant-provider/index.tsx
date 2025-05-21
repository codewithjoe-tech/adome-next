"use client";

import axiosInstance from "@/axios/public-instance";
import LoadingPage from "@/components/global/loading-page";
import { getSubdomain } from "@/constants";
import { setAppInfo } from "@/Redux/slices/app-details";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const fetchTenant = async () => {
  const response = await axiosInstance.get(`tenant/${getSubdomain()}/metadata`);
  return response.data;
};

const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: tenant, isLoading, isError } = useQuery({
    queryKey: ["tenant" , getSubdomain()],
    queryFn: fetchTenant,
    retry: false,
  });

  useEffect(() => {
    if (tenant?.logo) {
      console.log(tenant)
      dispatch(setAppInfo({ tenant, schemaName:tenant.subdomain }));

      // Remove existing favicons properly
      const existingIcons = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']");
      existingIcons.forEach((icon) => icon.parentNode?.removeChild(icon));

      // Create new favicon with cache-busting timestamp
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = `${tenant.logo}?v=${Date.now()}`;
      newFavicon.type = "image/png";

      document.head.appendChild(newFavicon);
    }
  }, [tenant, dispatch]);

  if (isLoading) return <LoadingPage />;
  if (isError) {
    // router.replace("/404");
    // return null;
  }

  return <>{children}</>;
};

export default TenantProvider;
