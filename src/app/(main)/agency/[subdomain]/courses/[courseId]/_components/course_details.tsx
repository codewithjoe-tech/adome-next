import BlockTextEditor from '@/components/global/rich-text-editor'
import { JSONContent } from 'novel'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator'


type Props = {
  content: string,
  htmlContent: string,
  JsonContent: JSONContent,
  module : any
}

const CourseDetails = ({ content, htmlContent, JsonContent , module }: Props) => {
  console.log(module)
  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-4">Course Details</h2>

      {/* <ul className="space-y-2 text-muted-foreground">
             <li className="flex items-center">
               <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
               </svg>
               Build responsive web applications with React
             </li>
             <li className="flex items-center">
               <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
               </svg>
               Style applications with Tailwind CSS
             </li>
             <li className="flex items-center">
               <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
               </svg>
               Deploy projects to production
             </li>
           </ul> */}
      <BlockTextEditor
        name="viewer"
        content={JsonContent}
        setContent={() => { }}
        min={0}
        max={100000}
        errors={{}}
        textContent={content}
        setTextContent={() => { }}
        htmlContent={htmlContent}
        setHtmlContent={() => { }}
        onEdit={false}
        inline={true}
        className="pl-0 pr-0"
      />
  <Separator className='my-9' />
        <h2 className="text-2xl font-semibold my-4">What you will Learn ?</h2>
<Accordion className="mt-8 space-y-4" type="single" collapsible>
  {module && module.map((value: any) => (
    <AccordionItem key={value.title} value={value.title} className="border rounded-md">
      <AccordionTrigger className="p-4 text-base font-medium">
        {value.title}
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground">
        <ul className="list-disc list-inside space-y-2">
          {value.chapters.map((chapter: any) => (
            <li key={chapter.title}>{chapter.title}</li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>



    </div>
  )
}

export default CourseDetails