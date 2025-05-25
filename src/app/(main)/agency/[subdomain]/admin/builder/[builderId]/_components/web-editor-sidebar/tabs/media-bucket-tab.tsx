"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { CheckCircle, Copy } from "lucide-react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/axios/public-instance";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { v4 as uuidv4 } from "uuid";

type ImageItem = {
  id: string;
  image: string;
  content_type: string;
  optimistic?: boolean;
};

type CardProps = {
  imgURlL: string;
  optimistic?: boolean;
};

const MediaCard = ({ imgURlL, optimistic }: CardProps) => {
  const [clicked, setClicked] = useState(false)
  useEffect(() => {
    
    if(clicked){
      setTimeout(() => {
        setClicked(false)
      }, 2000);

    }
  }, [clicked])
  
  return (
    <Card className="w-full h-60 relative overflow-hidden group mt-3">
      <CardContent className="w-full h-full p-0 relative">
        <Image
          src={imgURlL}
          alt="Media"
          fill
          className={`object-cover transition-opacity duration-300 ${
            optimistic ? "opacity-50" : "opacity-100"
          }`}
        />
        {!optimistic && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="text-white p-2 bg-black/50 rounded-full hover:bg-black/70"
              onClick={() =>{ 
                
                navigator.clipboard.writeText(imgURlL)
                setClicked(true)
              
              }}
            >
            {!clicked &&  <Copy size={24} />}
            {clicked &&  <CheckCircle className="text-green-600" size={24} />}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MediaBucketTab = () => {
  const contenttype = "website";
  const { schemaName } = useSelector((state: RootState) => state.app);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const fetchImages = async ({
    pageParam = 1,
    contenttype,
  }: {
    pageParam?: number;
    contenttype: string;
  }) => {
    const res = await axiosInstance.get(
      `mediamanager/${schemaName}/get-bucket/${contenttype}?page=${pageParam}`
    );
    return res.data;
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("content_type", contenttype);
    const res = await axiosInstance.post(`mediamanager/${schemaName}/upload-tenant`, formData);
    return res.data; 
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["images", contenttype],
    queryFn: ({ pageParam = 1 }) => fetchImages({ pageParam, contenttype }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : undefined,
  });

  const { mutate } = useMutation({
    mutationFn: uploadImage,
    onMutate: async (file: File) => {
      const tempId = uuidv4();
      const previewUrl = URL.createObjectURL(file);

      await queryClient.cancelQueries({ queryKey: ["images", contenttype] });

      const previousData = queryClient.getQueryData(["images", contenttype]);

      queryClient.setQueryData(["images", contenttype], (old: any) => {
        if (!old) return old;

        const optimisticItem: ImageItem = {
          id: tempId,
          image: previewUrl,
          content_type: contenttype,
          optimistic: true,
        };

        const pages = [...old.pages];
        const lastPage = pages[pages.length - 1];

        const updatedLastPage = {
          ...lastPage,
          results: [optimisticItem, ...lastPage.results],
        };

        pages[pages.length - 1] = updatedLastPage;

        return { ...old, pages };
      });

      return { tempId, previousData };
    },

    onSuccess: (data, _file, context) => {
      queryClient.setQueryData(["images", contenttype], (old: any) => {
        if (!old || !context) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            results: page.results.map((img: any) =>
              img.id === context.tempId ? { ...data, optimistic: false } : img
            ),
          })),
        };
      });
    },

    onError: (_err, _file, context) => {
      if (!context) return;

      queryClient.setQueryData(["images", contenttype], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            results: page.results.filter(
              (img: any) => img.id !== context.tempId
            ),
          })),
        };
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      mutate(file);
    }
  };

  return (
    <div className="h-[900px] overflow-scroll p-4 space-y-7">
      <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
        Upload Image
      </Button>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

     <div className="flex flex-col gap-3 mt-26">
       {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.results.map((img: ImageItem) => (
            <MediaCard
              key={img.id}
              imgURlL={img.image}
              optimistic={img?.optimistic}
            />
          ))}
        </React.Fragment>
      ))}

     </div>
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
};

export default MediaBucketTab;
