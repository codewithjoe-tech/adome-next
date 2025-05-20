"use client";
import axiosInstance from "@/axios/public-instance";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditorProvider from "@/providers/editor/editor-provider";
import { RootState } from "@/Redux/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheckIcon, CheckCircle, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import WebEditor from "../[builderId]/_components/web-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAzure } from "@/providers/assure-provider";

type Props = {
  site: any;
};

const BuilderCard = ({ site }: Props) => {
  const { schemaName } = useSelector((state: RootState) => state.app);
  const {
    handleOpen,
    setTitle,
    setDescription,
    setOnConfirm,
  } = useAzure();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`builder/${schemaName}/website/${id}`);
      return id;
    },  
    onMutate : (id)=>{
        toast.success("Website deleted Successfully!",{
            description : `The website with the id : ${id} has been deleted `
        })
        queryClient.setQueryData(['website'],(oldData:any)=>{
            return oldData.filter((web:any)=>web.id!==id)
        })
    },
    onSuccess: (id) => {
    //   queryClient.invalidateQueries({ queryKey: ["website"] });
    
    },
  });

  const makeDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.put(`builder/${schemaName}/change-default/${id}`);
      return id;
    },
    onMutate : (updatedId)=>{
        toast.success("Default Changed successfully",{
            description : "The default website has been changed to " + updatedId as string
        })
        queryClient.setQueryData(['website' ], (oldData:any)=>{
            if(!oldData) return oldData
            return oldData.map((site: any) => ({
                ...site,
                is_default: site.id === updatedId,
              }));
        })
    }
    ,
    onSuccess: (updatedId) => {
    //   queryClient.invalidateQueries({ queryKey: ["website"] });
    
    },
  });

  const handleDelete = ()=>{
    handleOpen()
    setTitle("Delete Website?");
    setDescription("Are you sure you want to delete this website? This action cannot be undone.");
    setOnConfirm(() => {
      // call delete mutation here
      deleteMutation.mutate(site.id);
    });
    // handleOpen();
  }

  const handleDefault = ()=>{
    handleOpen()
    setTitle("Make Website Default")
    setDescription("This action will make the page default and people will be seeing this as your landing page.")
    setOnConfirm(()=>{
        makeDefaultMutation.mutate(site.id)
    })
  }

  return (
    <Card
      key={site.id}
      className="relative  group bg-themeBlack w-80 h-80 rounded-lg shadow-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
    //   onMouseEnter={() => setHoveredCard(site.id)}
    //   onMouseLeave={() => setHoveredCard(null)}
      onClick={() => router.push(`/admin/builder/${site.id}`)}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <div className="absolute inset-0">
            <div className="scale-[0.25] overflow-hidden origin-top-left pointer-events-none w-[400%] h-[400%]">
            {site.is_default && (
   <Badge className="absolute z-[999] bottom-0 right-1  text-3xl">Default</Badge>
  )}

              <EditorProvider webId={site.id} pageDetails={site.web_data}>
                <WebEditor webPageId={site.id} liveMode={true} />
              </EditorProvider>
            </div>
          </div>
        </AspectRatio>
        <div className="p-4">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <span>{site.title}</span>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-themeBlack text-white border-zinc-700">
              {!site.is_default && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDefault()
                  }}
                >
                 <CheckCheckIcon /> Make Default
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                //   deleteMutation.mutate(site.id);
                if (!site.is_default){

                    handleDelete()
                }else{
                    toast.error("Unsuccessfull action",{
                        description : "You cannot delete the default website. To delete it you have to create a new website and make it default."
                    })
                }
                }}
                className="text-red-500 hover:text-red-500"
              >
               <Trash /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 text-sm text-zinc-400">
        This is a website builder component, here you can design how your landing page should look like.
        
      </CardContent>

     
    </Card>
  );
};

export default BuilderCard;
