"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/global/gradiant-text";
import CourseCard from "@/components/Course/course-card";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/axios/public-instance";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useRouter } from "next/navigation";
import { loadRazorpay } from "@/constants";
import withSubscriptionCheck from "@/HOC/subscription-check";

const PAGE_LIMIT = 6;

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { schemaName } = useSelector((state: RootState) => state.app);
  const razorpayReady = loadRazorpay();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  if (!razorpayReady) {
    alert("Razorpay loading error");
  }

  const fetchCourses = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`course/${schemaName}/get-courses`, {
      params: { page: pageParam, limit: PAGE_LIMIT, search: debouncedSearch },
    });

    return {
      courses: response.data?.results || [],
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
    queryKey: ["courses", debouncedSearch],
    queryFn: fetchCourses,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCourseRef = useCallback(
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

  const handleOnClick = (id: number) => {
    queryClient.setQueryData(["courses", debouncedSearch], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          courses: page.courses.map((course: any) =>
            course.id === id ? { ...course, owned: true } : course
          ),
        })),
      };
    });
  };

  const allCourses = data?.pages.flatMap((page) => page.courses) || [];
  const showNoCourses =
    !isLoading && !isError && allCourses.length === 0 && debouncedSearch === "";
  const showNoResults =
    !isLoading && !isError && allCourses.length === 0 && debouncedSearch !== "";

  return (
    <div className="flex flex-col items-center p-6">
      <GradientText
        className="text-[35px] md:text-[40px] lg:text-[55px] xl:text-[70px] 2xl:text-[80px] leading-tight font-semibold"
        element="H1"
      >
        Discover <br className="md:hidden" /> Courses
      </GradientText>

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search courses..."
        className="w-1/2 p-2 border rounded-md shadow-sm mt-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-40 w-full max-w-7xl">
        {isLoading &&
          [...Array(PAGE_LIMIT)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-80" />
          ))}

        {isError && (
          <p className="text-red-500 col-span-full">Failed to load courses.</p>
        )}

        {allCourses.map((course: any, index: number) => {
          const isLast = index === allCourses.length - 1;

          return (
            <div
              key={course.id}
              ref={isLast ? lastCourseRef : null}
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <CourseCard
                id={course.id}
                title={course.title}
                thumbnail={course.thumbnail}
                price={course.price}
                content={course.content}
                onClick={handleOnClick}
                owned={course.owned}
              />
            </div>
          );
        })}
      </div>

      {showNoCourses && (
        <p className="text-gray-500 text-xl mt-10">No courses available.</p>
      )}
      {showNoResults && (
        <p className="text-gray-500 text-xl mt-10">No results found.</p>
      )}

      {isFetchingNextPage && (
        <p className="text-gray-500 mt-4">Loading more...</p>
      )}
    </div>
  );
};

export default withSubscriptionCheck(React.memo(Page));
