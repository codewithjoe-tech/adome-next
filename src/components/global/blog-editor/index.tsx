'use client'
import axiosInstance from "@/axios/public-instance";
import { RootState } from "@/Redux/store";
import { Editor } from "novel-lightweight";

import React, { useState } from 'react'
import { useSelector } from "react-redux";

type Props = {
  className: string,
  data : string,
  setData: (data: string) => void
}

const BlogEditor = (props: Props) => {

const {schemaName} = useSelector((state:RootState)=>state.app)
const uploadFile = async (file:any)=>{
  try{

    console.log(schemaName)
    const formData = new FormData()
    formData.append('image' , file)
    formData.append('content_type' , 'blog')
    const response = await axiosInstance.post(`mediamanager/${schemaName}/upload-tenant`, formData)
    console.log(response)
    
    return response.data.image
  }catch (error:any){
    console.log(error)

  }


}


  return (
    <>
      <Editor
        {...props}
        defaultValue={props.data}
        disableLocalStorage={true}
        onUpdate={(editor) => {
          props.setData(editor?.storage.markdown.getMarkdown());
        }}
        handleImageUpload={async (file) => {
          const image = await uploadFile(file);
          if (image) {
            return image;
          }
          return "https://www.example.com/failed-upload.png";
        }}
      />

    </>
  )
}

export default BlogEditor