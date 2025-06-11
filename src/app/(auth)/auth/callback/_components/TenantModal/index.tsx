"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import TenantForm from '@/components/forms/TenantForm'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { TenantFormType } from '@/types'
import BackdropGradient from '@/components/global/backdrop-gradiant'
import { useToast } from '@/hooks/use-toast'
import axiosInstance from '@/axios/public-instance'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
  

type Props = {
    open: boolean 
  
    title? : "APP LINK" | "Create Agency",
    subdomain : string | null
    setSubdomain : (subdomain : string | null) => void
}
// name : string
// logo : string
// domain : string
// founding_year : string
// location : string
// description : string
// blog: boolean
// community : boolean
// newsletter : boolean
// courses : boolean
// }



const TenantCreateModal = ({open , title , subdomain , setSubdomain }: Props) => {


  const tenantSchema = z.object({
  name: z.string({required_error : "Name is required!"}).min(4, "Minimum 4 letters are required"),
  logo: z.string().min(1, "Logo is required"),
  subdomain: z
    .string({required_error : "Subdomain is required!"})
    .min(4, "Minimum 4 letters are required")
   
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Invalid subdomain format"),
  contact_email: z.string({required_error : "Email is required!"}).email("Valid email is required"),
  location: z.string({required_error : "Location is required!"}).min(4, "Minimum 4 letters"),
  description: z.string({required_error : "Description is required!"}).min(10, "Minimum 10 letters are required").max(200 , "200 letters exceeded!"),
  blog: z.boolean().default(false),
  community: z.boolean().default(false),
  newsletter: z.boolean().default(false),
  courses: z.boolean().default(false),
});
  

  const form  = useForm<TenantFormType>({
    // ts-ignore
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      logo: "",
      subdomain: "",
      contact_email: "",
      location: "",
      description: "",
      blog: true,
      community: false,
      newsletter: false,
      courses: false,
    },
  })
  const {toast } = useToast()
  const { schemaName } = useSelector((state: RootState) => state.app)
  const router = useRouter()

 

  const onSubmit: SubmitHandler<TenantFormType> = async(data) => {
    console.log("Form submitted", data)
    try {
      const response = await axiosInstance.post(`tenant/${schemaName}/tenant`, data)
      console.log(response)
      if (response.status === 200 || response.status ===201) {
        toast({
          title : "Success",
          description : "Registered successfully",
          variant : "default"
        })
        setSubdomain(response.data.subdomain)
        console.log(response.data.subdomain)
        form.reset()
      }

  } catch (error:any) {
    console.log(error)
    if(error.status===400){

      if (error.response.data.subdomain){
        toast({
          title : "Error",
          description : error.response.data.subdomain || error.response.data.error,
          variant:"destructive"
        })
        
      }else{
        toast({
          title : "Error",
          description : "An unexpected error occured",
          variant:"destructive"
        })
      }
    }
  }
  // setActiveTab('login')
};
  

const navigatePage = ()=>{
    window.location.href = `http://${subdomain}.theadome.xyz/admin`
    // router.push(`/agency/${subdomain}/admin`)
}


  return (
    <Dialog open={open} > 
  
  <DialogContent className='bg-themeBlack'>

    <DialogHeader>
      <DialogTitle>{title || "Create Agency"}</DialogTitle>
      <DialogDescription>
       
      </DialogDescription>
    </DialogHeader>
    {
      subdomain ? (
        <Button onClick={navigatePage} className='bg-[#333337] w-full  text-white hover:text-[#333337]'>Go To DashBoard <ArrowRight /></Button>
      ) : (

        <TenantForm form={form} onSubmit={onSubmit} switches={false} />
      )
    }
  </DialogContent>
</Dialog>


  )
}

export default TenantCreateModal