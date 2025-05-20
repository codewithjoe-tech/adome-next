"use client"

import React from "react"
import { SubmitHandler, UseFormReturn } from "react-hook-form"
import { useSelector } from "react-redux"
import { RootState } from "@/Redux/store"

import FileUpload from "@/components/global/File-upload"
import { CourseFormValues } from "@/constants/schemas"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import BlockTextEditor from "@/components/global/rich-text-editor"

type Props = {
    form: UseFormReturn<CourseFormValues>,
    onSubmit: SubmitHandler<CourseFormValues>,
    actionText?: string
}

const CourseForm = ({ form, onSubmit, actionText = "Create course" }: Props) => {
    const { schemaName } = useSelector((state: RootState) => state.app)

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-center">
                <FileUpload
                    apiEndpoint={`mediamanager/${schemaName}/upload-tenant`}
                    value={form.watch("thumbnail") || ""}
                    onChange={(url?: string) => form.setValue("thumbnail", url || '')}
                    contentType='course'
                />
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-6"
                >

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="FullStack Course" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="e.g., 49.99"
                                        value={field.value}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />




                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="JsonContent"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Course Content</FormLabel>
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
                    </div>


                    <div className="md:col-span-2 flex justify-between">
                        <FormField
                            control={form.control}
                            name="published"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-y-0">
                                    <FormLabel className="mr-4">Publish now:</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage className="ml-2" />
                                </FormItem>

                            )}
                        />
                        <Button type="submit">
                            {actionText}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CourseForm
