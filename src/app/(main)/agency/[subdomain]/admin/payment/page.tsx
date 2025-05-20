"use client"

import React from 'react'
import PaymentFormCard from './_components/payment-form-card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentSchema, PaymentSchemaType } from '@/constants/schemas'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import axiosInstance from '@/axios/public-instance'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Spinner } from '@/app/components/ui/spinner'
import PaymentAnalyticsPayment from './_components/payment-analytics'
import withSubscriptionCheck from '@/HOC/subscription-check'



type Props = {}

const Page = (props: Props) => {
  const queryClient = useQueryClient()
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const {data , isLoading, isError} = useQuery({
    queryKey : ['check-connected'],
    queryFn : async()=>{
      const response = await axiosInstance.get(`payment/${schemaName}/check-connected`)
      return response.data
    }
  })

  const connectPayment = async (data:PaymentSchemaType)=>{
    const response = await axiosInstance.post(`/payment/${schemaName}/gateway-register`,data)
    return response.data
  }
  const paymentMutation = useMutation({

    mutationKey : ['payment-connect'],
    mutationFn : connectPayment,
    onSuccess : (data : PaymentSchemaType)=>{
      queryClient.setQueryData(['check-connected'],(odlData:any)=>{
        return {connected:true}
      })
      toast.success("Saved successfully")
    },
    onError :(error)=>{
      console.log(error)
      toast.error(error.message)
    },
    
    
  })
  const onSubmit = (data:PaymentSchemaType)=>{paymentMutation.mutate(data)}
  const form = useForm({
    resolver : zodResolver(PaymentSchema),
    defaultValues : {
      name : "",
      email : "",
      bank_account_number : "",
      bank_ifsc : "",
      pan_number : "",
      phone : ""
    }
  })
  return (


    <div>
      {isLoading && (
        <Spinner />
      )}
      {(!data?.connected && !isLoading) &&

        <PaymentFormCard actionText='Connect' form={form} onSubmit={onSubmit}  />
      }
      {
        data?.connected && (
          <PaymentAnalyticsPayment/>
        )
      }
    </div>
  )
}

export default withSubscriptionCheck(React.memo(Page));