"use client"

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChapterForm from '@/components/forms/ChapterForm';
import { chapterSchema, ChapterType } from '@/constants/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/axios/public-instance';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';
import withSubscriptionCheck from '@/HOC/subscription-check';
type Props = {
  params: Promise<{ moduleId: string }>;
}

const page = (props: Props) => {
  const {moduleId} = React.use(props.params)
  console.log(moduleId)
  const form = useForm<ChapterType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      htmlContent: "",
      JsonContent: undefined,
      video : '',
      module : moduleId
    }
  })
  const router = useRouter()
  const queryClient = useQueryClient()
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const uploadChapter = useMutation({
    mutationKey : ['upload-chapter'],
    mutationFn : async (data: ChapterType) => {
      const response = await axiosInstance.post(`course/${schemaName}/create-chapter`, data)
      return response.data
    },
    onMutate : (data) => {
      const tempId = v4(); 
      queryClient.setQueryData(['getChapters', moduleId], (oldData: any) => {
        return [...oldData, {...data , created_at : new Date(),id : tempId}]
      })
      toast.success("Chapter created successfully", {
        description : "Chapter has been created successfully"
      })
      form.reset()
      router.push(`/admin/modules/${moduleId}/chapters`)
      return {tempId}
    },
    onError : (error: any) => {
      console.log(error)
      toast.error("Failed", { description: "Chapter creation failed!" });
    },
    onSuccess : (data, chapterData : ChapterType, context)=>{
      queryClient.setQueryData(['getChapters', moduleId],(oldData:ChapterType[])=>{
        return oldData.map((value:ChapterType)=>{
          if(value.id===context.tempId){
            return data
          }
          return value
        })
      })
    }
  })
  
  return (
    <div className="flex flex-col items-center min-h-screen">
    <div className="w-full max-w-4xl">
      <Card className="bg-themeBlack">
        <CardHeader>
          <CardTitle>Create Course</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto bg-themeBlack">
          {/* <CourseForm form={form} onSubmit={onSubmit}  /> */}
          <ChapterForm actionText="Create chapter" form={form} onSubmit={(data:ChapterType)=>{uploadChapter.mutate(data)}}  />
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

export default withSubscriptionCheck(React.memo(page));
