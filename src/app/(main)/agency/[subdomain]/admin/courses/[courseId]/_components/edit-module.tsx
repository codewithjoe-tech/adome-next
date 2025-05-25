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
import { Pencil, Trash2 } from 'lucide-react'


type module = {
  title : string,
  description : string,
  created_at? : string,
  id ? : number
}
type Props = {
  module : module,
  courseId : string
  
}
const ModuleEditDialog = ({module , courseId}:Props) => {
    const { schemaName } = useSelector((state: RootState) => state.app)
    const moduleId = module.id
    
    
  const queryClient = useQueryClient()

  const [title, setTitle] = useState(module.title)
  const [description, setDescription] = useState(module.description)
  const [isOpen, setIsOpen] = useState(false)

  // const handleSubmit = async () => {
  //   try {
  //     if (!schemaName || !moduleId) return toast.error("Missing course or tenant info")

  //     await axiosInstance.post(`course/${schemaName}/manage-modules/${moduleId}`, {
  //       course:moduleId,
  //       title,
  //       description,
  //     })
  //     toast.success("Module created")

  //     queryClient.invalidateQueries({
  //       queryKey: ['course-modules', moduleId]
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
  //   course:moduleId,
  //   title,
  //   description,
  // }
  const editModule = async (module: module) => {
    const { id, ...rest } = module;
    if (!schemaName || !id) throw new Error("Missing schema or module ID");
  
    const response = await axiosInstance.put(`course/${schemaName}/manage-modules/${id}`, rest);
    return response.data;
  }
  
  const editMutation = useMutation({
    mutationKey : ['module-edit' , moduleId],
    mutationFn : editModule,
    onMutate : (newData:module)=>{
      // console.log("in on mutate")
      // console.log(newData)
      toast.success("Module updated successfully!",{
        description : `Module with the id : ${moduleId} has been updated successfully`
      })
      queryClient.setQueryData(['course-modules', courseId],(oldData:any)=>{
        // console.log(oldData)
        // console.log(module.id)
       return oldData.map((value:module)=>{
        return value.id === moduleId ? {...value , title, description} : value
       })
      })
      setIsOpen(false)
      setTitle('')
      setDescription('')

    }
  })

  

  const handleSubmit = ()=>{
    // console.log(moduleId)
    editMutation.mutate({id : moduleId, title , description})
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger >
        {/* <Button onClick={() => setIsOpen(true)}>Create Module +</Button> */}
         <Pencil className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className='bg-themeBlack p-6 rounded-lg'>
        <DialogHeader>
          <DialogTitle>Update Module</DialogTitle>
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
          update
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default ModuleEditDialog