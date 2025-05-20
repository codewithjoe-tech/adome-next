"use client"
import { Spinner } from '@/app/components/ui/spinner'
import axiosInstance from '@/axios/public-instance'
import BlogCards from '@/components/Blogs/blog-cards'
import { SkeletonCard } from '@/components/global/upload-dropzone/skelton-card'
import { RootState } from '@/Redux/store'
import { QueryClient, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import React, { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

type BlogPost = {
  id: number
  title: string
  image: string
  content: string
  published: boolean
  timestamps: string
  userDetails: {
    profile_pic: string | null
    full_name: string | null
  }
}

const PAGE_LIMIT = 10 

const page = () => {
  const { schemaName } = useSelector((state: RootState) => state.app)

  const queryClient =  useQueryClient()
  const onDelete = async (id:number)=>{
    const response = await axiosInstance.delete(`blog/${schemaName}/blog/${id}`)
    console.log(response)
    if (response.status === 204) {
      toast.success('Blog deleted successfully!')
      queryClient.invalidateQueries({
        queryKey: ['blogs']
      })
    }
  }

  const fetchBlogs = async ({ pageParam = 1 }) => {
    const response = await axiosInstance.get(`blog/${schemaName}/admin-blog`, {
      params: { page: pageParam, limit: PAGE_LIMIT }
    })

    console.log(response.data)
    const blogs = response.data?.results || []   
    return {
      blogs,
      nextPage: response.data.next ? pageParam + 1 : null
    }
  }

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['blogs'], 
    queryFn: fetchBlogs,
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => lastPage.nextPage
  })

  const observer = useRef<IntersectionObserver | null>(null)
  const lastBlogRef = useCallback(
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
        <p className="text-red-500">Error loading blog posts. Please try again later.</p>
      </div>
    )
  }

  if (!data?.pages?.[0]?.blogs.length) {
    return (
      <div className='text-center w-full h-full flex items-center justify-center'>
        <p className="text-gray-500">No blog posts found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-6 w-full justify-start">
    {data.pages.flatMap((page, pageIndex) =>
      page.blogs.map((blog: any, index: any) => {
        const isLastBlog =
          pageIndex === data.pages.length - 1 && index === page.blogs.length - 1;
        return (
          <div
            key={blog.id}
            ref={isLastBlog ? lastBlogRef : null}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"  // Adjust the width based on the screen size
          >
            <BlogCards {...blog} onDelete={onDelete} />
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
