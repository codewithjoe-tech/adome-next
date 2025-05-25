"use client"
import axiosInstance from '@/axios/public-instance'
import CourseCards from '@/components/Course/course-card'
import { SkeletonCard } from '@/components/global/upload-dropzone/skelton-card'
import { RootState } from '@/Redux/store'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Router } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'



const PAGE_LIMIT = 10 

const page = () => {
  const { schemaName } = useSelector((state: RootState) => state.app)
  
  const queryClient =  useQueryClient()
  const router = useRouter()
  const onDelete = async (id:number)=>{
    const response = await axiosInstance.delete(`course/${schemaName}/manage-course/${id}`)
    return id;
  }
  
  const courseDeleteMutation = useMutation({
    mutationKey : ['course-delete'],
    mutationFn : onDelete,
    onMutate: (id: number) => {
      queryClient.setQueryData(['courses'], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => {
            return {
              ...page,
              courses: page.courses.filter((course: any) => course.id !== id)
            };
          })
        };
      });
      
      toast.success("Deleted successfully!", {
        description: `Course with the id: ${id} has been deleted successfully!`
      });
    }
    ,    
    onError : (error , variable , context)=>{
      toast.error('Deletion Failed',{
        description : error.message
      })
    }
    
  })
  
  const fetchCourses = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`course/${schemaName}/admin-course-get`, {
      params: { page: pageParam }
    })
    
    console.log(response.data)
    const courses = response.data?.results || []   
    return {
      courses,
      nextPage: response.data.next ? pageParam + 1 : null
    }
  }

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['courses'], 
    queryFn: fetchCourses,
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => lastPage.nextPage
  })
  
  const observer = useRef<IntersectionObserver | null>(null)
  const lastCourseRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage()
          }
      })
      
      if (node) observer.current.observe(node)
      },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )
  
  if (isLoading) {
    return (
      <div className='flex flex-wrap gap-10 justify-center'>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }
  
  if (isError) {
    return (
      <div className='text-center w-full h-full flex items-center justify-center'>
        <p className="text-red-500">Error loading courses. Please try again later.</p>
      </div>
    )
  }

  if (!data?.pages?.[0]?.courses.length) {
    return (
      <div className='text-center w-full h-full flex items-center justify-center'>
        <p className="text-gray-500">No Courses found.</p>
      </div>
    )
  }
  
  const deleteController = (id:number)=>{
    courseDeleteMutation.mutate(id)
  }
  const onClick = (id:number)=>{
    
    router.push(`/admin/courses/${id}/modules`)
  }

  return (
    <div className="flex flex-wrap gap-6 w-full justify-start">
    {data.pages.flatMap((page, pageIndex) =>
      page.courses.map((courses: any, index: any) => {
        const isLastCourse =
          pageIndex === data.pages.length - 1 && index === page.courses.length - 1;
        return (
          <div
            key={courses.id}
            ref={isLastCourse ? lastCourseRef : null}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"  
          >
            <CourseCards {...courses} onDelete={deleteController} is_admin={true} onClick={onClick} />
          </div>
        );
      })
    )}
  
    {isFetchingNextPage && (
      <div className="flex flex-wrap gap-10 justify-center">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )}
  </div>
  
  
  )
}

export default page
