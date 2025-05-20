"use client"

import parse, { domToReact, Element } from "html-react-parser"
import { useEffect, useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextCopyButton from "@/app/(main)/agency/[subdomain]/admin/users/_components/text-copy"

type HtmlParserProps = {
  html: string
}

export const HtmlParser = ({ html }: HtmlParserProps) => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const transform = (node: any) => {
    if (
      node.type === "tag" &&
      node.name === "pre" &&
      node.children?.some((c: any) => c.name === "code")
    ) {
      const codeNode = node.children.find((c: any) => c.name === "code")
      const codeText = codeNode?.children?.[0]?.data || ""
  
      return (
        <div className="relative group my-4 rounded-lg border border-muted bg-muted overflow-hidden">
          {/* Copy Button */}
          <div className="absolute top-3.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <TextCopyButton text={codeText}  toastText="Code copied Successfully!" toastDescription="The code has been copied successfully to the clipboard"/>
          </div>
  
          <pre className="overflow-x-auto p-4 text-sm text-white">
            <code>{codeText}</code>
          </pre>
        </div>
      )
    }
  
    return undefined
  }
  

  return (
    <div className="[&_h1]:text-4xl [&_h2]:text-3xl [&_blockqoute]:italic [&_iframe]:aspect-video [&_h3]:text-2xl text-white flex flex-col gap-y-3">
      {mounted && parse(html, { replace: transform })}
    </div>
  )
}
