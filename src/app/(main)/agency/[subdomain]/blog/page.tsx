"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/global/gradiant-text";
import BlogCards from "@/components/Blogs/blog-cards";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/axios/public-instance";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useRouter } from "next/navigation";

const PAGE_LIMIT = 6;

const Page = () => {
  const router = useRouter();
  const { schemaName } = useSelector((state: RootState) => state.app);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchBlogs = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`blog/${schemaName}/blog`, {
      params: { page: pageParam, limit: PAGE_LIMIT, search: debouncedSearch },
    });

    return {
      blogs: response.data?.results || [],
      nextPage: response.data.next ? pageParam + 1 : null,
    };
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", debouncedSearch],
    queryFn: fetchBlogs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastBlogRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const blogsExist =
    data?.pages.some((page) => page.blogs.length > 0) ?? false;

  return (
    <div className="flex flex-col items-center p-6">
      {/* Header */}
      <GradientText
        className="text-[35px] md:text-[40px] lg:text-[55px] xl:text-[70px] 2xl:text-[80px] leading-tight font-semibold"
        element="H1"
      >
        Blogs <br className="md:hidden" /> Today
      </GradientText>

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search blogs..."
        className="w-1/2 p-2 border rounded-md shadow-sm mt-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-40 w-full max-w-7xl">
        {isLoading &&
          [...Array(PAGE_LIMIT)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-80" />
          ))}

        {isError && (
          <p className="text-red-500 col-span-full">Failed to load blogs.</p>
        )}

        {!isLoading &&
          !isError &&
          blogsExist &&
          data?.pages.map((page, pageIndex) =>
            page.blogs.map((blog: any, blogIndex: number) => {
              const isLastBlog =
                pageIndex === data.pages.length - 1 &&
                blogIndex === page.blogs.length - 1;

              return (
                <div key={blog.id} ref={isLastBlog ? lastBlogRef : null}>
                  <div
                    onClick={() => {
                      router.push(`/blog/${blog.id}`);
                    }}
                  >
                    <BlogCards
                      id={blog.id}
                      title={blog.title}
                      image={blog.image}
                      content={blog.content}
                      author={blog.author}
                      is_admin={false}
                      sm={false}
                      created_at={blog.created_at}
                    />
                  </div>
                </div>
              );
            })
          )}

        {!isLoading && !isError && !blogsExist && (
          <p className="text-center col-span-full text-gray-500 text-xl font-semibold">
            {debouncedSearch ? "No results found." : "No blogs available yet."}
          </p>
        )}
      </div>

      {isFetchingNextPage && (
        <p className="text-gray-500 mt-4">Loading more...</p>
      )}
    </div>
  );
};

export default Page;
