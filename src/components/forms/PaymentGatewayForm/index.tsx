import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { PaymentSchemaType } from '@/constants/schemas'

type Props = {
  form: UseFormReturn<PaymentSchemaType>,
  onSubmit: SubmitHandler<PaymentSchemaType>,
  actionText?: string
}

const GateWayForm = ({ form, onSubmit, actionText = "Submit" }: Props) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="joe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Joe Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_account_number"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Bank Account Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_ifsc"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Bank IFSC Code</FormLabel>
              <FormControl>
                <Input placeholder="SBIN0000123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pan_number"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>PAN Number</FormLabel>
              <FormControl>
                <Input placeholder="ABCDE1234F" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="md:col-span-1">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="000000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit">
            {actionText}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default GateWayForm
