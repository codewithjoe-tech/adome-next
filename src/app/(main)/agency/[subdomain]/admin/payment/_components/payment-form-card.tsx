"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GateWayForm from '@/components/forms/PaymentGatewayForm'
import { Form, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { PaymentSchemaType } from '@/constants/schemas'

type Props = {
  form : UseFormReturn<PaymentSchemaType>
  onSubmit : SubmitHandler<PaymentSchemaType>,
  actionText ? : string
}

const PaymentFormCard = ({form , onSubmit ,actionText}: Props) => {
  return (
    <div className='flex flex-col items-center min-h-screen'>
      <div className='w-full max-w-4xl'>
        <Card className='bg-themeBlack'>
          <CardHeader>
            <CardTitle>Connect Payment</CardTitle>
            <GateWayForm  form={form} onSubmit={onSubmit} actionText={actionText} />
          </CardHeader>

        </Card>
      </div>
    </div>
  )
}

export default PaymentFormCard