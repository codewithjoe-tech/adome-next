"use client";

import axiosInstance from "@/axios/public-instance";
import DataTable from "@/app/(main)/agency/[subdomain]/admin/users/_components/data-table";
// import { getSubdomain } from "@/constants";
import { columns } from "./_components/columns";
import { useRef, useCallback, useState,  useTransition } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/app/components/ui/spinner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

const Page = () => {
  const [selectStaff, setSelectStaff] = useState("user");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isPending, startTransition] = useTransition(); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    startTransition(() => {
      setDebouncedSearch(e.target.value);
    });
  };
  const {schemaName} = useSelector((state:RootState)=>state.app)

  const fetchUsers = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(
      `user/${schemaName}/tenantusers`,
      {
        params: {
          page: pageParam,
          search: debouncedSearch,
          staffOnly: selectStaff === "staff",
        },
      }
    );
    return { users: response.data.results, nextPage: response.data.next ? pageParam + 1 : null };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["users", debouncedSearch, selectStaff],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasNextPage || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && fetchNextPage(),
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage]
  );

  return (
    <>
      <div className="w-full flex justify-between items-center py-6 my-3">
        <div className="flex items-center gap-3">
          <Search />
          <Input
            placeholder="Search..."
            value={search} 
            onChange={handleSearchChange}
            className="outline-none focus:outline-none focus:ring-0 focus:ring-transparent focus:shadow-none active:ring-0" 
          />
        </div>
        <Select defaultValue="user" onValueChange={setSelectStaff}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="bg-themeBlack">
            <SelectItem className="focus:bg-themeGray" value="staff">
              Staff
            </SelectItem>
            <SelectItem className="focus:bg-themeGray" value="user">
              Users
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={data?.pages.flatMap((page) => page.users) || []} filterValue="Username" isLoading={isLoading || isPending} />

      {hasNextPage && (
        <div ref={lastUserRef} className="w-full flex items-center justify-center p-4">
          <Spinner size="small" />
        </div>
      )}
    </>
  );
};

export default Page;
