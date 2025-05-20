"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import axiosInstance from "@/axios/public-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CourseFormValues, courseSchema } from "@/constants/schemas";
import CourseForm from "@/components/forms/CourseForm";
import { useRouter } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const { schemaName } = useSelector((state: RootState) => state.app);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      thumbnail: "",
      content: "",
      htmlContent: "",
      JsonContent: undefined,
      price: 0,
      published: false,
    },
  });

  const createCourse = async (data: CourseFormValues) => {
    try {
      const res = await axiosInstance.post(`course/${schemaName}/create-course`, data);
      console.log("Response:", { status: res.status, data: res.data });
      return res.data;
    } catch (error) {
      console.error("Axios error:", error);
      throw error;
    }
  };

  const optimisticCourseMutation = useMutation({
    mutationKey: ["course-create"],
    mutationFn: createCourse,
    onSuccess: (newData) => {
      queryClient.setQueryData(["courses"], (oldData: any) => {
        if (!oldData) {
          return {
            pages: [
              {
                courses: [newData], 
                next: null,
                previous: null,
              },
            ],
            pageParams: [undefined],
          };
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: any) => {
            if (index === 0) {
              return {
                ...page,
                courses: [newData, ...(page.courses || [])], 
              };
            }
            return page;
          }),
        };
      });
      toast.success("Success", {
        description: "Course created successfully",
      });
      router.push("/admin/courses"); 
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast.error("Failed", { description: "Course creation failed!" });
    },
  });

  const onSubmit = (data: CourseFormValues) => {
    optimisticCourseMutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full max-w-4xl">
        <Card className="bg-themeBlack">
          <CardHeader>
            <CardTitle>Create Course</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto bg-themeBlack">
            <CourseForm form={form} onSubmit={onSubmit}  />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;