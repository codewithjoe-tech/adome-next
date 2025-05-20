"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CustomVideoPlayer from "./_components/custom-video-player";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import axiosInstance from "@/axios/public-instance";
import BlockTextEditor from "@/components/global/rich-text-editor";
import withSubscriptionCheck from "@/HOC/subscription-check";



type Props = {
  params : Promise<{courseWatchId : string} >
}

const Page = ({params}:Props) => {
  const {courseWatchId} = React.use(params)
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const [selectedChapter, setSelectedChapter] = useState({
    id: null,
  title: "",
  content: "",
  htmlContent: "",
  JsonContent: {
    type: "doc",
    content: [],
  },
  preview: false,
  created_at: "",
  video: "",
  })


  const {data , isLoading , isError} = useQuery({
    queryKey : ['get-course', courseWatchId],
    queryFn : async ()=>{
      const response = await axiosInstance.get(`course/${schemaName}/watch/course/${courseWatchId}`)
      return response.data
    },
    
  })

  useEffect(() => {
    if (data && data.modules?.length > 0 && data.modules[0].chapters?.length > 0) {
      setSelectedChapter(data.modules[0].chapters[0]);
    }
  }, [data]);
  
  
  const sampleVideoUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const samplePosterUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-[320px] h-[calc(100vh)] lg:sticky top-0 bg-sidebar border-r border-border overflow-y-auto p-5 shadow-inner -z-1">
        <h3 className="text-lg font-semibold mb-4">Course Content</h3>
        <Accordion type="multiple" className="space-y-2">
          {data && data.modules.map((module : any, index:any) => (
            <AccordionItem
              key={module.id}
              value={`module-${index}`}
              className="border-b border-muted"
            >
              <AccordionTrigger className="text-sm font-semibold text-primary">
                {module.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="mt-2 space-y-1">
                  {data && module.chapters.map((chapter:any, idx:any) => (
                    <li
                      key={chapter.id}
                      onClick={()=>{
                        setSelectedChapter(chapter)
                      }}
                      className="flex justify-between items-center text-sm px-3 py-2 rounded-md hover:bg-accent cursor-pointer transition"
                    >
                      <span className="truncate">{chapter.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {chapter.duration}
                      </span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Video Player */}
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-border">
          { data && <CustomVideoPlayer src={selectedChapter.video} poster={samplePosterUrl} key={selectedChapter.id} />}
          </div>

          {/* Current Chapter Title */}
          <h2 className="text-2xl font-bold text-primary">
            {selectedChapter.title}
          </h2>

          {/* Course Description */}
          <div className="bg-muted p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Course Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {data  && 
               <BlockTextEditor
               name="viewer"
               content={selectedChapter.JsonContent}
               setContent={() => { }}
               min={0}
               max={100000}
               errors={{}}
               textContent={selectedChapter.content}
               setTextContent={() => { }}
               htmlContent={selectedChapter.htmlContent}
               setHtmlContent={() => { }}
               onEdit={false}
               inline={true}
               className="pl-0 pr-0"
             />
            // <div></div>
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withSubscriptionCheck(React.memo(Page));
