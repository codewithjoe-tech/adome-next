"use client"

import { useEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Props = {}

const Layers = (props: Props) => {
  const { state } = useEditor()

  // Function to handle click on any item and log its details
  const handleItemClick = (item: any) => {
    console.log('Clicked item:', {
      id: item.id,
      name: item.name,
      type: item.type,
      styles: item.styles,
      content: item.content,
    })
  }

  // Recursive function to render the tree
  const renderTree = (elements: any[], depth: number = 0) => {
    return elements.map((item) => {
      const isContainer = ['__body', 'container', '2Col'].includes(item.type)

      if (isContainer) {
        return (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger
              className="text-sm text-gray-200 hover:bg-gray-700 px-2 py-1 rounded"
              onClick={() => handleItemClick(item)}
            >
              <span className="flex items-center">
                <span className="mr-2">📁</span>
                {item.name} ({item.type})
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              {Array.isArray(item.content) && item.content.length > 0 ? (
                renderTree(item.content, depth + 1)
              ) : (
                <div className="text-xs text-gray-400 pl-4">No children</div>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      } else {
        return (
          <div
            key={item.id}
            className="text-sm text-gray-400 pl-6 py-1 hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <span className="flex items-center">
              <span className="mr-2">📄</span>
              {item.name} ({item.type})
            </span>
          </div>
        )
      }
    })
  }

  return (
    <div className="w-64 bg-gray-900 text-white h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Website Structure</h2>
      <Accordion type="multiple" className="w-full">
        {renderTree(state.editor.elements)}
      </Accordion>
    </div>
  )
}

export default Layers