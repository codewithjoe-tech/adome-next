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
    import { useSelector } from 'react-redux'
    import { RootState } from '@/Redux/store'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import axiosInstance from '@/axios/public-instance'
    import { Spinner } from '@/app/components/ui/spinner'
    import { X } from 'lucide-react'
    import { toast } from 'sonner'
    import { QueryClient, useQueryClient } from '@tanstack/react-query'

    const BlogDialog = () => {
        const { schemaName } = useSelector((state: RootState) => state.app)
        const [title, setTitle] = useState("")
        const [image, setImage] = useState<File | null>(null)
        const [previewUrl, setPreviewUrl] = useState<string | null>(null)
        const [uploading, setUploading] = useState(false)
        const [isOpen, setIsOpen] = useState(false)  // State to control modal visibility
        const queryClient = useQueryClient()

        const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                setImage(file)
                setUploading(true)
                
                const formData = new FormData()
                formData.append("image", file)
                formData.append('content_type', "blog")
                
                try {
                    const response = await axiosInstance.post(`mediamanager/${schemaName}/upload-tenant`, formData)
                    setPreviewUrl(response.data.image)
                } catch (error) {
                    console.error("Image upload failed", error)
                } finally {
                    setUploading(false)
                }
            }
        }

        const handleImageDelete = () => {
            setImage(null)
            setPreviewUrl(null)
        }

        const handleCreateBlog = async () => {
            const response = await axiosInstance.post(`blog/${schemaName}/admin-blog`, {
                title,
                image: previewUrl,
                content: "Your blog content here",
                published: false,
            })
            if (response.status === 201) {
                toast.success("Blog created successfully", {
                    description: "Click on the edit to add content"
                })
                queryClient.invalidateQueries({
                    queryKey: ['blogs']
                })
                setIsOpen(false)  // Close the modal after successful submission
            } else {
                toast.error("Failed to create blog", {
                    description: "Please try again later"
                })
            }
        }

        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsOpen(true)}>Create Blog +</Button>
                </DialogTrigger>
                <DialogContent className='bg-themeBlack p-6 rounded-lg'>
                    <DialogHeader>
                        <DialogTitle>Create Blog</DialogTitle>
                        <DialogDescription className='hidden'>
                            Here you can create the blog and after creating it will be redirected to the editor page
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Blog Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter blog title"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="image">Upload Thumbnail</Label>
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        
                        {uploading && <Spinner />}
                        
                        {previewUrl && (
                            <div className="mt-4 relative">
                                <p className="text-sm text-gray-500">Preview:</p>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-auto rounded-lg shadow-md"
                                />
                                <X
                                    className='absolute top-0 right-0 cursor-pointer text-muted-foreground'
                                    size={16}
                                    onClick={handleImageDelete}
                                />
                            </div>
                        )}
                    </div>
                    <Button onClick={handleCreateBlog} disabled={!(previewUrl && title)}>Submit</Button>
                </DialogContent>
            </Dialog>
        )
    }

    export default BlogDialog
