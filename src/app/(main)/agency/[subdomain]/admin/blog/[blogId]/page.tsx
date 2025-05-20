"use client";

import axiosInstance from "@/axios/public-instance";
import BlogEditor from "@/components/global/blog-editor";
import InfoBar from "@/components/global/infobar";
import BlockTextEditor from "@/components/global/rich-text-editor";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RootState } from "@/Redux/store";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { JSONContent } from "novel";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
  params : {
    blogId : string
  }
}

const Page = ({params} : Props) => {
  const { blogId } = useParams();
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("")
  const [published , setPublished] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [content, setContent] = useState<JSONContent | undefined>(undefined )
  const [textContent, setTextContent] = useState<string | undefined>('')
  const [htmlContent, setHtmlContent] = useState<string | undefined>('')
  
  const fetchBlog = async () =>{
    try{
      const response = await axiosInstance.get(`blog/${schemaName}/blog-get/${blogId}`);
      console.log(response.data)

      setContent(response.data.JsonContent || {
        'doc' : {
          content : []
        }
      })
      setHtmlContent(response.data.htmlContent)
      setTextContent(response.data.content)
      setTitle(response.data.title)
      setThumbnail(response.data.image)
      setPublished(response.data.published)
    }catch(err){
      toast.error("Unexpected error")
    }
  }

  useEffect(() => {
    fetchBlog()

  }, [blogId])

  useEffect(()=>{
    onSubmit()
  },[content , htmlContent , textContent])

  const saveBlog = async () => {
    try{
      const response = await axiosInstance.put(`blog/${schemaName}/blog/${blogId}`, {content: textContent , htmlContent , JsonContent : content, title, published , });
      if(response.status === 200){
        toast.success("Blog updated successfully")
      }
    }catch(err){
      toast.error("Unexpected error")
    }
  }

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // useEffect(() => {
  //   if (isFirstRender) {
  //     setIsFirstRender(false);
  //     return;
  //   }
  //   saveBlog();
  // }, [published]);
  const onSubmit = () => {
    console.log('JSON:', content)
    console.log('Text:', textContent)
    console.log('HTML:', htmlContent)
  }
  

  return (
    <div className="w-full min-h-screen overflow-y-auto flex flex-col items-center px-6">
      <nav className="w-full shadow-md py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-50">
        <h2 className="text-xl font-bold">Blog Editor</h2>
        <div className="flex space-x-4 items-center">
          <Label>Published</Label>
          <Switch checked={published} onCheckedChange={()=>{
            setPublished(!published)
           
          }} />
        <Button onClick={saveBlog} >Save</Button>
        </div>
      </nav>

      <div className="w-full max-w-3xl mt-20">
      <Input
  
  className="font-bold text-4xl md:text-5xl border-0 outline-none text-left  h-24"
  dir="ltr"  
  value={title}

  onChange={handleTitleChange}
/>
  

        <Separator className="mt-6 mb-10" />

        <AspectRatio ratio={16 / 9}>
          <Image
            src={thumbnail}
            alt="thumbnail"
            fill
            className="rounded-lg object-cover"
          />
        </AspectRatio>
      </div>

      <div className="w-full max-w-4xl ">

        {/* <BlogEditor className="w-full overflow-y-auto selection:bg-themeDarkGray " data={data} setData={setData} /> */}
        <form onSubmit={handleSubmit(onSubmit)}>
        
{content &&  <BlockTextEditor
    name="editor"
    content={content}
    setContent={setContent}
    min={1}
    max={100000}
    errors={errors}
    textContent={textContent}
    setTextContent={setTextContent}
    onEdit={true}
    inline={false}
    htmlContent={htmlContent}
    setHtmlContent={setHtmlContent}
    className="w-[94%] mx-auto h-screen mt-5"
    
  />
}

     
    </form>
      </div>
    </div>
  );
};

export default Page;
