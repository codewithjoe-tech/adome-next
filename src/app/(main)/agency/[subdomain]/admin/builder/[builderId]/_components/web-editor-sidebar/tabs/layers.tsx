'use client'

import { useEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { File, Folder, FolderOpen } from 'lucide-react'

type Props = {}

const Layers = (props: Props) => {
  const { state, dispatch } = useEditor()

  const handleItemClick = (item: any, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: item,
      },
    })
    console.log('Clicked item:', {
      id: item.id,
      name: item.name,
      type: item.type,
      styles: item.styles,
      content: item.content,
    })
  }

  const renderTree = (elements: any[], depth: number = 0) => {
    return (
      <ul className="w-full space-y-0.5">
        {elements.map((element) => {
          const isContainer = ['__body', 'container', '2Col'].includes(element.type)
          const isSelected = state.editor.selectedElement?.id === element.id

          const baseClasses =
            'text-sm py-0.5 rounded-md cursor-pointer transition-all animate-fade-in relative flex items-center'
          const selectedClasses = isSelected
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'

          if (isContainer) {
            return (
              <li key={element.id} className="w-full relative">
                <AccordionItem value={element.id} className="border-none">
                  <AccordionTrigger
                    className={`group ${baseClasses} ${selectedClasses} pl-1`}
                    onClick={(e) => handleItemClick(element, e)}
                  >
                    <span className="relative mr-2 h-4 w-4">
                      <Folder className="absolute h-4 w-4 -left-1 transition-opacity duration-200 ease-in-out group-[data-state=open]:opacity-0" />
                      <FolderOpen className="absolute h-4 w-4 -left-1 opacity-0 transition-opacity duration-200 ease-in-out group-[data-state=open]:opacity-100" />
                    </span>
                    {element.name} ({element.type})
                  </AccordionTrigger>
                  <AccordionContent className="py-0 pl-5 border-l relative">
                    {Array.isArray(element.content) && element.content.length > 0 ? (
                      renderTree(element.content, depth + 1)
                    ) : (
                      <div className="text-sm text-muted-foreground py-0.5">No children</div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </li>
            )
          } else {
            return (
              <li
                key={element.id}
                className={`${baseClasses} ${selectedClasses}`}
                onClick={(e) => handleItemClick(element, e)}
              >
                <File className="mr-2 h-4 w-4" />
                {element.name} ({element.type})
              </li>
            )
          }
        })}
      </ul>
    )
  }

  return (
    <div className="w-full bg-transparent text-sidebar-foreground h-full p-3 pl-6">
      <h3 className="font-bold mb-4">Web Structure</h3>
      <Accordion type="multiple" className="w-full">
        {renderTree(state.editor.elements)}
      </Accordion>
    </div>
  )
}

export default Layers
