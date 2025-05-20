"use client"
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, Copy } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
    size?: number
    className?: string
    text: string
    toastText? : string
    toastDescription?:string

}

const TextCopyButton = ({ size = 16, className='', text, toastText = "Email Copied" , toastDescription = "Email has been copied to your clipboard." }: Props) => {
    const [copied, setCopied] = useState<boolean>(true)
    const handleCopy = () => {
        setCopied(false)
        navigator.clipboard.writeText(text)
        // toast({
        //     title: "Email Copied!",
        //     description: "Email has been copied to your clipboard.",
        // })
        toast.success(toastText , {
            description : toastDescription
        })
        setTimeout(() => {
            setCopied(true)
        }, 2000)
    }
    return (
        <>
            {
                copied ? (
                    <Copy className={"cursor-pointer" + className} size={size} onClick={handleCopy} />
                ):(
                    <CheckCircle size={size} color='green'  />
                )
            }
        </>
    )
}

export default TextCopyButton