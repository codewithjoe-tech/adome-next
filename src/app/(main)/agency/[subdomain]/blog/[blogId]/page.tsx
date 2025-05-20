"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/axios/public-instance";

import { RootState } from "@/Redux/store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import Image from "next/image";
import BlockTextEditor from "@/components/global/rich-text-editor"; // ✅ Import the block editor
import CommentSection from "./_components/comment-section";

const BlogDetails = () => {
  const { blogId } = useParams();
  const { schemaName } = useSelector((state: RootState) => state.app);

  const fetchBlog = async () => {
    const response = await axiosInstance.get(
      `blog/${schemaName}/blog-get/${blogId}`
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: fetchBlog,
    enabled: !!blogId,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load the blog post.
      </div>
    );
  }

  const { title, image, date, JsonContent, userDetails, content, htmlContent } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-32 py-10">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
  
    <div className="flex items-center gap-3 mb-6">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={userDetails?.profile_pic}
          alt={userDetails?.full_name}
        />
        <AvatarFallback>
          {userDetails?.full_name?.[0] ?? "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{userDetails?.full_name}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
    </div>
  
    {image && (
      <div className="w-full mb-10 max-w-3xl">
        <Image
          src={image}
          height={300}
          width={800}
          alt="Cover"
          className="w-full h-auto rounded-lg shadow-md object-cover"
        />
      </div>
    )}
  
    {JsonContent && (
      <div>
        <BlockTextEditor
          name="viewer"
          content={JsonContent}
          setContent={() => {}}
          min={0}
          max={100000}
          errors={{}}
          textContent={content}
          setTextContent={() => {}}
          htmlContent={htmlContent}
          setHtmlContent={() => {}}
          onEdit={false}
          inline={true}
          className="pl-0 pr-0"
        />
      </div>
    )}


    <CommentSection userDetails={userDetails} contentId={blogId as string} />
  </div>
  
  );
};

export default BlogDetails;
