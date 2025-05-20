"use client"

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { toast } from 'sonner'
import axiosInstance from '@/axios/public-instance'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AutosizeTextarea } from '@/components/ui/text-area'
import { usePathname } from 'next/navigation'
import { v4 } from 'uuid'
const useCourseIdFromPath = () => {
  const pathname = usePathname()
  const courseId = React.useMemo(() => {
    const parts = pathname.split('/')
    const index = parts.findIndex(p => p === 'courses')
    return parts[index + 1] || null
  }, [pathname])
  return courseId
}

type module = {
  course : string,
  title : string,
  description : string,
  created_at? : string,
  id ? : string
}
const ModuleDialog = () => {
    const { schemaName } = useSelector((state: RootState) => state.app)
    const courseId = useCourseIdFromPath()
    
    
  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // const handleSubmit = async () => {
  //   try {
  //     if (!schemaName || !courseId) return toast.error("Missing course or tenant info")

  //     await axiosInstance.post(`course/${schemaName}/manage-modules/${courseId}`, {
  //       course:courseId,
  //       title,
  //       description,
  //     })
  //     toast.success("Module created")

  //     queryClient.invalidateQueries({
  //       queryKey: ['course-modules', courseId]
  //     })

  //     setIsOpen(false)
  //     setTitle("")
  //     setDescription("")
  //   } catch (err) {
  //     console.error(err)
  //     toast.error("Something went wrong")
  //   }
  // }

  // {
  //   course:courseId,
  //   title,
  //   description,
  // }
  const createModule = async (module : module)=>{
  
          if (!schemaName || !courseId) throw("schemaName or courseId missing")
    
          await axiosInstance.post(`course/${schemaName}/manage-modules/${courseId}`,module )
          // toast.success("Module created")
    
      //  WIP
        
       
  }

  const moduleCreateMutation = useMutation({
    mutationKey : ['module-create' , courseId],
    mutationFn : createModule,
    onMutate : (data : module)=>{

      const newData = {
        ...data,
        id : v4(),
        created_at : new Date()
      }
        setIsOpen(false)
          setTitle("")
          setDescription("")
        queryClient.setQueryData(['course-modules', courseId],(oldData:module[])=>{
          return [
            ...oldData,
            newData,
        ]
        })
      toast.success("Module created successfully", {
        description : "Module has been created successfully!"
      })
      return newData
    },
    onSettled : ()=>{
      queryClient.invalidateQueries({queryKey :['course-modules', courseId]})
    },
    onError : (error)=>{
      toast.error("Module creation failed",{
        description : "Module creation failed due to an unexpected error on the server. "
      })
    }
  })


  const handleSubmit = ()=>{
    moduleCreateMutation.mutate({course: courseId as string , title , description})
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Create Module +</Button>
      </DialogTrigger>
      <DialogContent className='bg-themeBlack p-6 rounded-lg'>
        <DialogHeader>
          <DialogTitle>Create Module</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Module title" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <AutosizeTextarea
              className='bg-themeBlack'
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Module description"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!(title && description)}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default ModuleDialog