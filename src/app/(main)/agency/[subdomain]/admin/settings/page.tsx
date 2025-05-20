"use client"

import TenantForm from '@/components/forms/TenantForm';
import { RootState } from '@/Redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TenantFormType } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from '@/axios/public-instance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { setAppInfo } from '@/Redux/slices/app-details';
import { toast } from 'sonner';

const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subdomain: z.string().min(1, 'Subdomain is required'),
  contact_email: z.string().email('Invalid email'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  blog: z.boolean().optional(),
  community: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  courses: z.boolean().optional(),
  logo: z.string().optional(),
});



const Page = () => {
  const { tenant , schemaName} = useSelector((state: RootState) => state.app);
  const queryClient = useQueryClient()
  // const {toast} = useToast()
  const dispatch = useDispatch()
  const subdomain = tenant.subdomain


  const form = useForm<TenantFormType>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '',
      subdomain: '',
      contact_email: '',
      location: '',
      description: '',
      blog: false,
      community: false,
      newsletter: false,
      courses: false,
      logo: '',
    },
  });

  useEffect(() => {
    console
    if (tenant) {
      form.reset({
        name: tenant.name || '',
        subdomain: tenant.subdomain || '',
        contact_email: tenant.contact_email || '',
        location: tenant.location || '',
        description: tenant.description || '',
        blog: tenant.blog || false,
        community: tenant.community || false,
        newsletter: tenant.newsletter || false,
        courses: tenant.courses || false,
        logo: tenant.logo || '',
      });
    }
  }, [tenant, form]);
  
  const updateTenant = async (updatedData:TenantFormType)=>{
    const {data} = await axiosInstance.put(`tenant/${subdomain}/tenant/${subdomain}`,updatedData)
    return data
  }

  const optimisticTenantUpdate = useMutation({
    mutationKey : ['updateTenant', schemaName],
    mutationFn : updateTenant,
    onMutate : async (newData : TenantFormType)=>{
      await queryClient.cancelQueries({queryKey :['tenant' , schemaName]})

      const previousData = queryClient.getQueryData<TenantFormType>(['tenant',schemaName])
      queryClient.setQueryData(['tenant',schemaName], (previousData:TenantFormType)=>({
        ...(previousData || {}),
        ...newData
      }))
        toast("Success" , {
          description : "Tenant updated successfully",
        })
      return {previousData}

    },
    onSuccess : (data : TenantFormType)=>{
      queryClient.invalidateQueries({ queryKey: ['tenant', schemaName] });
      
      if (data) dispatch(setAppInfo({tenant : data , schemaName: tenant.subdomain}))

      


    },
    onError: (_err, _newData, context:any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['tenant', schemaName], context.previousData); 
        // dispatch
      }
      toast.error('Update failed!' , { description : "Tenant updation failed" });
    },
  });



  





  const onSubmit = (data: TenantFormType) => {
   optimisticTenantUpdate.mutate(data)
  };

  return (
    <div className='flex flex-col items-center min-h-screen'>
      <div className='w-full max-w-4xl'>
        <Card className='bg-themeBlack'>
          <CardHeader>
            <CardTitle>Update Settings</CardTitle>
          </CardHeader>
          <CardContent className='overflow-auto bg-themeBlack'>
            <TenantForm form={form} onSubmit={onSubmit} switches={true} actionText='Update' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
