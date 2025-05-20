"use client"

import React, { useEffect } from 'react'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/axios/public-instance';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';
import withSubscriptionCheck from '@/HOC/subscription-check';
type Props = {
  params: Promise<{ chapterId: string  , moduleId : string}>;
}

const page = (props: Props) => {
  const {chapterId , moduleId} = React.use(props.params)
  const {data , isLoading , isError} = useQuery({
    queryKey : ['getChapter' , chapterId],
    queryFn : async () => {
      const response = await axiosInstance.get(`course/${schemaName}/manage-chapters/${chapterId}`)
      return response.data
    }
  })
  const form = useForm<ChapterType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      htmlContent: "",
      JsonContent: undefined,
      video : '',
    }
  })

  useEffect(() => {
    if (data) {

        form.reset({
            id  : chapterId,
            title : data.title,
            video : data.video,
            JsonContent : data.JsonContent,
            content : data.content,
            htmlContent : data.htmlContent,
            module: moduleId, 
           })
    }
  }, [data])
  
  const router = useRouter()
  const queryClient = useQueryClient()
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const uploadChapter = useMutation({
    mutationKey : ['update-chapter' , chapterId],
    mutationFn : async (data: ChapterType)  => {
      const response = await axiosInstance.put(`course/${schemaName}/manage-chapters/${chapterId}`, data)
      return response.data
    },
    onMutate : (data) => {
      queryClient.setQueryData(['getChapters', moduleId], (oldData: ChapterType[]) => {
        if(oldData){
            return oldData.map((old:ChapterType)=>{
              if(old.id === data.id){
                return data
              }
              return old
            })
          // return [...oldData, {...data , created_at : new Date()}]
        }
        return oldData
      })
      toast.success("Chapter created successfully", {
        description : "Chapter has been created successfully"
      })
      form.reset()
      router.push(`/admin/modules/${moduleId}/chapters`)
    },
    onSuccess :(data ,mutatedData : ChapterType )=>{
      queryClient.setQueryData(['getChapters', moduleId],(oldData : ChapterType[])=>{
        oldData.map((value)=>{
          if(value.id==mutatedData.id){
            return data
          }
          return value
        })
      })
    },
    onError : (error: any) => {
      console.log(error)
      toast.error("Failed", { description: "Chapter creation failed!" });
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
          <ChapterForm actionText="Update chapter" form={form} onSubmit={(data:ChapterType)=>{uploadChapter.mutate(data)}}  />
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

export default withSubscriptionCheck(React.memo(page));
