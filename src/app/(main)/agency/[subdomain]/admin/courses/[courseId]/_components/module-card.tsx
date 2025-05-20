import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { Pencil, Trash2 } from 'lucide-react'
import { formatTimeAgo } from '@/utils'
import { useRouter } from 'next/navigation'
import { useAzure } from '@/providers/assure-provider'
import ModuleEditDialog from './edit-module'
import Link from 'next/link'

type Props = {
  module: {
    id: number
    title: string
    description: string
    created_at: string
    updated_at: string
    course : string
  },
  deleteMutation? : any
  courseId : string
  link: string
}

const ModuleCard = ({ module,deleteMutation,courseId,link }: Props) => {
  const user = useSelector((state: RootState) => state.user.user) 
  const {
    handleOpen,
    setTitle,
    setDescription,
    setOnConfirm,
  } = useAzure();

  const handleDelete = ()=>{
    handleOpen()
    setTitle("Delete Module?");
    setDescription("Are you sure you want to delete this module? This action cannot be undone.");
    setOnConfirm(() => {
      // call delete mutation here
      
      deleteMutation.mutate(module.id);
    });
  }
  

  const isAdmin = user?.is_admin;

  return (
    <Card  className="group relative bg-themeBlack overflow-hidden transition-all hover:shadow-lg cursor-pointer">
      <Link href={link}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
        {/**/}
      </CardHeader>
      <CardContent >
        <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
        <p className="text-xs text-gray-500">Created: {formatTimeAgo(module.created_at)}</p>
     
      </CardContent>

      </Link>
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ModuleEditDialog module={module} courseId={courseId}  />
          <Button onClick={handleDelete} variant="destructive" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  )
}

export default ModuleCard
