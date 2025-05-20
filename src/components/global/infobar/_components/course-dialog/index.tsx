"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { Spinner } from '@/app/components/ui/spinner'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import axiosInstance from '@/axios/public-instance'
import { useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const CourseDialog = () => {
    const { schemaName } = useSelector((state: RootState) => state.app)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [published, setPublished] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            setUploading(true)

            const formData = new FormData()
            formData.append("image", file)
            formData.append("content_type", "course")

            try {
                const res = await axiosInstance.post(`mediamanager/${schemaName}/upload-tenant`, formData)
                setPreviewUrl(res.data.image)
            } catch (err) {
                console.error("Image upload error:", err)
                toast.error("Image upload failed")
            } finally {
                setUploading(false)
            }
        }
    }

    const handleImageDelete = () => {
        setImage(null)
        setPreviewUrl(null)
    }

    const handleCreateCourse = async () => {
        try {
            const res = await axiosInstance.post(`course/${schemaName}/create-course`, {
                title,
                description,
                price: parseFloat(price),
                thumbnail: previewUrl,
                published,
            })

            if (res.status === 201) {
                toast.success("Course created successfully")
                queryClient.invalidateQueries({
                    queryKey: ['courses']
                })
                setIsOpen(false)
                setTitle("")
                setDescription("")
                setPrice("")
                setPreviewUrl(null)
                setPublished(false)
            } else {
                toast.error("Course creation failed")
            }
        } catch (err) {
            toast.error("Something went wrong")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>Create Course +</Button>
            </DialogTrigger>
            <DialogContent className='bg-themeBlack p-6 rounded-lg'>
                <DialogHeader>
                    <DialogTitle>Create Course</DialogTitle>
                    <DialogDescription className='hidden'>
                        Fill in the details to create your course
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course description" />
                    </div>

                    <div>
                        <Label htmlFor="price">Price (USD)</Label>
                        <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="Enter price" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="published" checked={published} onCheckedChange={setPublished} />
                        <Label htmlFor="published">Published</Label>
                    </div>

                    <div>
                        <Label htmlFor="thumbnail">Upload Thumbnail</Label>
                        <Input id="thumbnail" type="file" accept="image/*" onChange={handleImageChange} />
                        {uploading && <Spinner />}
                    </div>

                    {previewUrl && (
                        <div className="relative mt-4">
                            <p className="text-sm text-gray-500">Preview:</p>
                            <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
                            <X
                                className='absolute top-0 right-0 cursor-pointer text-muted-foreground'
                                size={16}
                                onClick={handleImageDelete}
                            />
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleCreateCourse}
                    disabled={!(title && description && price && previewUrl)}
                >
                    Submit
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default CourseDialog
