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
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const WebDialog = () => {
    const { schemaName } = useSelector((state: RootState) => state.app)
    const [title, setTitle] = useState("")
    const [isOpen, setIsOpen] = useState(false)  
    const queryClient = useQueryClient()

    const handleCreateBlog = async () => {
        const response = await axiosInstance.post(`builder/${schemaName}/website`, {
            title,
        })
        if (response.status === 201) {
            toast.success("Website created successfully", {
                description: "Click on the edit to add content"
            })
            queryClient.invalidateQueries({
                queryKey: ['website']
            })
            setIsOpen(false)  
        } else {
            toast.error("Failed to create website", {
                description: "Please try again later"
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>Create Website +</Button>
            </DialogTrigger>
            <DialogContent className='bg-themeBlack p-6 rounded-lg'>
                <DialogHeader>
                    <DialogTitle>Create Website</DialogTitle>
                    <DialogDescription className='hidden'>
                        Here you can create a website and after creating it will be redirected to the editor page
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Website Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter website title"
                        />
                    </div>
                </div>
                <Button onClick={handleCreateBlog} disabled={!title}>Submit</Button>
            </DialogContent>
        </Dialog>
    )
}

export default WebDialog
