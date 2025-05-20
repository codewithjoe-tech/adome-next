import { Button } from '@/components/ui/button'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UploadDropzone from '../upload-dropzone'

type Props = {
  apiEndpoint: string
  onChange: (url?: string) => void
  value?: string,
  contentType?: string
}

const FileUpload = ({ apiEndpoint, onChange, value, contentType }: Props) => {
  const type = value?.startsWith('http') ? value.split('.').pop() : value?.split('.').pop()
  const isVideo = ['mp4', 'webm', 'ogg'].includes(type?.toLowerCase() || '')
  const isYouTubeId = value && !value.startsWith('http') && /^[a-zA-Z0-9_-]{6,20}$/.test(value)

  const isImage = value && (value.startsWith('http') || ['jpg', 'jpeg', 'png', 'gif'].includes(type?.toLowerCase() || ''))
  console.log(isVideo, isImage, isYouTubeId, value)

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {isYouTubeId ? (
          <div className="relative w-full max-w-md aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${value}?modestbranding=1`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : isVideo ? (
          <div className="relative w-full max-w-md aspect-video">
            <video
              src={value}
              className="w-full h-full object-contain"
              controls
            />
          </div>
        ) : isImage ? (
          <div className="relative w-40 h-40">
            <Image
              src={value || 'https://a65h5aua68.ufs.sh/f/c42d559a-5217-4d28-90fc-eea67f71ace4-n3ch5g.jpg'}
              alt="uploaded image"
              className="object-contain"
              fill
            />
          </div>
        ) : type === 'pdf' ? (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400"
            >
              View PDF
            </a>
          </div>
        ) : null}
        <Button
          onClick={() => onChange('')}
          variant="ghost"
          type="button"
        >
          <X className="h-4 w-4" />
          Remove File
        </Button>
      </div>
    )
  }
  return (
    <div className="w-full bg-themeBlack">
      <UploadDropzone
        apiEndpoint={apiEndpoint}
        onUploadComplete={(url: string) => {
          console.log(url)
          onChange(url)
        }}
        onUploadError={(error: string) => {
          console.log(error)
        }}
        contentType={contentType}
      />
    </div>
  )
}

export default FileUpload