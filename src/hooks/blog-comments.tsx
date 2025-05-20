import axiosInstance from '@/axios/public-instance'
import { RootState } from '@/Redux/store'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryFunctionContext,
} from '@tanstack/react-query'
import { useSelector } from 'react-redux'

type User = {
  full_name: string
  profile_pic: string
}

type Comment = {
  id: number
  user: User
  content: string
  created_at: string
  parent: number | null
}

type PaginatedResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Comment[]
}

export const useComments = (
  contentId: string,
  userDetails: User
) => {
  const queryClient = useQueryClient()

  const schemaName = useSelector((state: RootState) => state.app.schemaName)

  const queryKey = ['comments', schemaName,  contentId]

  const fetchComments = async (
    ctx: QueryFunctionContext<typeof queryKey, number>
  ): Promise<PaginatedResponse> => {
    const page = ctx.pageParam ?? 1

    const res = await axiosInstance.get(`/comment/${schemaName}/comments/${contentId}`, {
      params: {
    
        contentId,
        page,
      },
    })
    return res.data
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse, Error, InfiniteData<PaginatedResponse>, typeof queryKey, number>({
    queryKey,
    queryFn: fetchComments,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.next ? pages.length + 1 : undefined
    },
  })

  const addComment = useMutation({
    mutationFn: async (newContent: string): Promise<Comment> => {
      const res = await axiosInstance.post(`/comment/${schemaName}/comments/manage/${contentId}`, {
        contentType :"blog",
        contentId,
        
        content: newContent,
      })
      return res.data
    },

    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<
        InfiniteData<PaginatedResponse>
      >(queryKey)

      const optimisticComment: Comment = {
        id: Date.now(),
        user: userDetails,
        content: newContent,
        created_at: new Date().toISOString(),
        parent: null,
      }

      queryClient.setQueryData<InfiniteData<PaginatedResponse>>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              results: [optimisticComment, ...old.pages[0].results],
            },
            ...old.pages.slice(1),
          ],
          pageParams: old.pageParams,
        }
      })

      return { previousData }
    },

    onError: (_err, _newContent, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      await axiosInstance.delete(`/comment/${schemaName}/comments/manage/${contentId}`, {
        params: { id: commentId },
      })
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey })
  
      const previousData = queryClient.getQueryData<
        InfiniteData<PaginatedResponse>
      >(queryKey)
  
      queryClient.setQueryData<InfiniteData<PaginatedResponse>>(queryKey, (old) => {
        if (!old) return old
  
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results.filter((comment) => comment.id !== commentId),
          })),
          pageParams: old.pageParams,
        }
      })
  
      return { previousData }
    },
    onError: (_err, _commentId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
  
  

  return {
    comments: data?.pages.flatMap((page) => page.results) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    addComment,
    deleteComment
  }
}
