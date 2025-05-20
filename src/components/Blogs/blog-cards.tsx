"use client"
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formatTimeAgo } from "@/utils";
// import Link from "next/link";

type Props = {
  title: string;
  image: string;
  content: string;
  author?: string;
  onDelete?: (id:number) => void; 
  id  : number,
  is_admin? : boolean 
  sm? : boolean
  created_at : string
};

const BlogCards = ({ id, title, image, content, author, onDelete , is_admin = true , sm , created_at }: Props) => {
  const router = useRouter()
 
  return (
<Card
  className={`relative group bg-themeBlack w-full rounded-lg shadow-2xl overflow-hidden cursor-pointer ${
    sm ? "max-w-[280px]" : "max-w-[360px]"
  }`}
>{
is_admin &&
      <Button
      onClick={()=>{onDelete && onDelete(id)}}
      className="absolute top-3 right-3 z-10  p-2  opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      }


      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={image}
            alt="Thumbnail"
            fill
            className="rounded-t-lg object-cover object-top"
          />
        </AspectRatio>
        <div className="p-4">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <CardDescription>{content.slice(0 , 70)}...</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between px-4 pb-4 mt-4 text-sm text-gray-400">
       <div className="flex flex-col">
       <span>{author}</span>
       <span>{formatTimeAgo(created_at)}</span> 
       </div>
       {
is_admin &&
         <button
         onClick={() => (router.push(`/admin/blog/${id}`))}
         className="text-blue-500 hover:underline"
  >
    Edit
  </button>
        }
      </CardFooter>
    </Card>
  );
};

export default BlogCards;
