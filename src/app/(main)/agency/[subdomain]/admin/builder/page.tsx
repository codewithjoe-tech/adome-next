"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/axios/public-instance";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import BuilderCard from "./_components/builder-card";

const Page = () => {
  const { schemaName } = useSelector((state: RootState) => state.app);

  const { data, isLoading, error } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const response = await axiosInstance.get(`builder/${schemaName}/website`);
      return response.data;
    },
  });

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error fetching websites</p>;

  if (data.length === 0) {
    return (
      <div className="p-4 text-zinc-400 text-center w-full">
        No websites have been built yet.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap gap-4 p-4">
      {data.map((site: any) => (
        <BuilderCard key={site.id} site={site} />
      ))}
    </div>
  );
};

export default Page;
