import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { formatTimeAgo } from '@/utils'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/axios/public-instance'
import { useAzure } from '@/providers/assure-provider'
import { toast } from 'sonner'
import Link from 'next/link'

type ChapterProps = {
  chapter: {
    id: number
    title: string
    content: string
    created_at: string
    updated_at: string
  },
  moduleId : string
}
const ChapterCard = ({ chapter,moduleId }: ChapterProps) => {
  const {
      handleOpen,
      setTitle,
      setDescription,
      setOnConfirm,
    } = useAzure();
  
  const user = useSelector((state: RootState) => state.user.user)
  const isAdmin = user?.is_admin
  
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const queryClient = useQueryClient()
  const deleteChapterMutation = useMutation({
    mutationKey : ['delete-chapter'],
    mutationFn : async (chapterId: number) => {
      const response = await axiosInstance.delete(`course/${schemaName}/manage-chapters/${chapterId}`)
      return response.data
    }
    ,
    onMutate : (chapterId) => {
      queryClient.setQueryData(['getChapters', moduleId], (oldData: any) => {
        return oldData.filter((chapter: any) => chapter.id !== chapterId)
      })
      toast.success("Chapter deleted successfully", {
        description : `Chapter with the id ${chapterId} has been deleted successfully!`
      })
    }
  })
  const handleDelete = () => {
    handleOpen()
    setTitle("Delete Chapter?");
    setDescription("Are you sure you want to delete this chapter? This action cannot be undone.");
    setOnConfirm(() => {
      deleteChapterMutation.mutate(chapter.id)
      
    })
  }
  return (
    <Card className="group relative min-w-72 max-w-72 bg-themeBlack overflow-hidden transition-all hover:shadow-lg cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{chapter.title.length > 20 ? chapter.title.slice(0, 20) + "..." : chapter.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{chapter.content.length > 40 ? chapter.content.slice(0, 40) + "..." : chapter.content}</p>
        <p className="text-xs text-gray-500">Created: {formatTimeAgo(chapter.created_at)}</p>
      </CardContent>

      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Optional admin actions, can be linked to edit/delete */}
          <Button onClick={handleDelete} variant="destructive" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Link href={`/admin/modules/${moduleId}/chapters/${chapter.id}`}><Button><Edit /></Button></Link>
        </div>
      )}
    </Card>
  )
}

export default ChapterCard
