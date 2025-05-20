"use client"

import React, { useEffect, useState } from "react"
import { SubmitHandler, UseFormReturn } from "react-hook-form"
import { useSelector } from "react-redux"
import { RootState } from "@/Redux/store"

import FileUpload from "@/components/global/File-upload"
import BlockTextEditor from "@/components/global/rich-text-editor"

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
import { Switch } from "@/components/ui/switch"

import { ChapterType } from "@/constants/schemas"

type Props = {
  form: UseFormReturn<ChapterType>
  onSubmit: SubmitHandler<ChapterType>
  actionText?: string
}

const ChapterForm = ({ form, onSubmit, actionText = "Save chapter" }: Props) => {
  const { schemaName } = useSelector((state: RootState) => state.app)
  const videoValue = form.getValues("video");
const [useYoutubeId, setUseYoutubeId] = useState(() => {
  return videoValue && !videoValue.startsWith("http");
});
useEffect(() => {
  console.log("Form Errors:", form.formState.errors);
}, [form.formState.errors]);

  return (
    <div className="flex flex-col items-center w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 w-full max-w-3xl mt-6"
        >
          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Video Source</FormLabel>
                  <div className="flex items-center space-x-2">
                    <span>{ "Enter YouTube ID" }</span>
                    <Switch
                      checked={useYoutubeId || false}
                      onCheckedChange={(checked) => {
                        setUseYoutubeId(checked)
                        form.setValue("video", "") 
                      }}
                    />
                  </div>
                </div>
                <FormControl>
                  {useYoutubeId ? (
                    <Input
                      placeholder="Enter YouTube Video ID (e.g., dQw4w9WgXcQ)"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  ) : (
                    <FileUpload
                      apiEndpoint={`mediamanager/${schemaName}/upload-video`}
                      value={field.value || ""}
                      onChange={(url?: string) => field.onChange(url || '')}
                      contentType="chapter"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Chapter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="JsonContent"
            render={() => (
              <FormItem>
                <FormLabel>Chapter Content</FormLabel>
                <BlockTextEditor
                  key={form.watch("JsonContent")?.length ?? 0}
                  name="JsonContent"
                  content={form.watch("JsonContent")}
                  setContent={(value) => form.setValue("JsonContent", value)}
                  htmlContent={form.watch("htmlContent") ?? undefined}
                  setHtmlContent={(value: any) => form.setValue("htmlContent", value ?? '')}
                  textContent={form.watch("content") ?? ''}
                  setTextContent={(value: any) => form.setValue("content", value ?? '')}
                  min={20}
                  max={10000}
                  errors={form.formState.errors}
                  onEdit={true}
                  className="p-4 pl-8 border rounded max-h-96 h-96 overflow-auto"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{actionText}</Button>
        </form>
      </Form>
    </div>
  )
}

export default ChapterForm