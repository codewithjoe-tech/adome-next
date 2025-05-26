"use client"
import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { TenantFormType } from '@/types'
import { Input } from "@/components/ui/input"
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import FileUpload from '@/components/global/File-upload'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from "@/components/ui/switch"


type Props = {
  form: UseFormReturn<TenantFormType>,
  onSubmit: SubmitHandler<TenantFormType>,
  switches: boolean,
  actionText?: string
}

const TenantForm = ({ form, onSubmit, switches, actionText = "Register" }: Props) => {
  const { schemaName, tenant } = useSelector((state: RootState) => state.app)

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex justify-center">
        <FileUpload
          apiEndpoint={`mediamanager/${schemaName}/upload`}
          value={form.watch("logo") || ""}
          onChange={(url?: string) => form.setValue("logo", url || '')}
        />

      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Brototype" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Domain</FormLabel>
                <FormControl>
                  <div className='flex '>
                    <Input placeholder="brototype" {...field} />
                    <Badge className=' bg-[#333337] hover:bg-[#333337] text-white'>.theadome.xyz</Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Kerala, India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormDescription>Write a brief description of your agency. This will be used for SEO.</FormDescription>
                <FormControl>
                  <Textarea placeholder="Describe your agency..." {...field} className="min-h-[120px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {switches &&
            (
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="blog"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 border rounded-lg bg-themeBlack">
                      <FormLabel className="text-white">Blog</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />



                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 border rounded-lg bg-themeBlack">
                      <FormLabel className="text-white">Newsletter</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={tenant.subscription_plan === '1'} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="community"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 border rounded-lg bg-themeBlack">
                      <FormLabel className="text-white">Community</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={tenant.subscription_plan === '1'} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courses"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-3 border rounded-lg bg-themeBlack">
                      <FormLabel className="text-white">Courses</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={tenant.subscription_plan === '1'} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )
          }

          <div className="col-span-2 flex justify-center">
            <Button className='bg-[#333337] rounded-2xl text-white hover:text-[#333337]' type="submit">{actionText}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default TenantForm
