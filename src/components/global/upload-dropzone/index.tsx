"use client"

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import axiosInstance from "@/axios/public-instance";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

type UploadDropzoneProps = {
  apiEndpoint: string;
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  contentType? : string
};

const UploadDropzone = ({ apiEndpoint, onUploadComplete, onUploadError ,contentType}: UploadDropzoneProps) => {
  // const {toast} = useToast()
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const formData = new FormData();
      if(contentType){
        formData.append("image", file);
        formData.append("content_type", contentType);

      }else{

        formData.append("file", file);
      }

      const response = await axiosInstance.post(apiEndpoint, formData);

      if (response.status >= 200 && response.status < 300) {
        if(contentType){
          onUploadComplete(response.data.image)
        }else{

          onUploadComplete(response.data.file); 
        }
        toast.success("Success",{
          description: 'File uploaded successfully',
        })
      } else {
        toast('Error',{
          description: 'Failed to upload file',
        })
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      onUploadError?.(error.response?.data?.message || error.message);
    }
  }, [apiEndpoint, onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-themeTextGray/40 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer  "
    >
      <input {...getInputProps()} />
      <UploadCloud className="h-8 w-8 text-gray-400" />
      <p className="mt-2 text-sm text-gray-400">
        {isDragActive ? "Drop the file here..." : "Drag & drop a file, or click to select"}
      </p>
    </div>
  );
};

export default UploadDropzone;
