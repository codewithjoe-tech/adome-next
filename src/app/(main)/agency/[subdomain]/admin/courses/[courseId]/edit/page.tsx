"use client";

import React, { useEffect } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CourseFormValues, courseSchema } from "@/constants/schemas";
import CourseForm from "@/components/forms/CourseForm";
import { useRouter } from "next/navigation";

type Props = {
  params: Promise<{ courseId: string }>;
};

const Page = ({params}: Props) => {
  const { schemaName } = useSelector((state: RootState) => state.app);
  const { courseId } = React.use(params)

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

  const {data, isLoading , isError} = useQuery({
    queryKey : ['get-course' , courseId],
    queryFn : async ()=>{
        const res = await axiosInstance.get(`course/${schemaName}/manage-course/${courseId}`);
        // console.log(res.data)
        return res.data
    }
  })

  useEffect(() => {
   if(data){
    form.reset({
      title : data.title,
      thumbnail : data.thumbnail,
      JsonContent : data.JsonContent,
      content : data.content,
      htmlContent : data.htmlContent,
      price : data.price,
      published : data.published
     })
     console.log("Form reset with:", data)
   }
  }, [data])
  

  const updateCourse = async (data: CourseFormValues) => {

    try {
      const res = await axiosInstance.put(`course/${schemaName}/manage-course/${courseId}`, data);
      console.log("Response:", { status: res.status, data: res.data });
      return res.data;
    } catch (error) {
      console.error("Axios error:", error);
      throw error;
    }
  };

  const optimisticCourseMutation = useMutation({
    mutationKey: ["course-update"],
    mutationFn: updateCourse,
    onSuccess: (newData) => {
      queryClient.setQueryData(["courses"], (oldData: any) => {
        if (!oldData) return oldData;
      
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => {
            return {
              ...page,
              courses: page.courses.map((course: any) =>
                course.id === newData.id ? newData : course
              ),
            };
          }),
        };
      });

      queryClient.setQueryData(['get-course' , courseId],newData)
      toast.success("Success", {
        description: "Course updated successfully",
      });
      // router.push("/admin/courses"); 
    },
    onError: (error: any) => {
      console.error("Mutation error:", error.message);
      toast.error("Failed", { description: error.message });
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
            <CourseForm form={form} onSubmit={onSubmit} actionText="Update" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;