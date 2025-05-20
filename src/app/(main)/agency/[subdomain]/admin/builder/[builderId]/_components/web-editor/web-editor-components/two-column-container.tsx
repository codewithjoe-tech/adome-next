'use client'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import RecursiveElement from './recursive'

import { v4 } from 'uuid'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { defaultStyles, EditorBtns } from '@/constants'
import { Trash } from 'lucide-react'

type Props = {
  element: EditorElement
}

const TwoColumns = (props: Props) => {
  const { id, content, type } = props.element
  const { dispatch, state } = useEditor()

   const handleOnDrop = (e: React.DragEvent, type: string  ) => {
     e.stopPropagation()
     const existingElementId = e.dataTransfer.getData('existingElementId')
     if(state.editor.previewMode || state.editor.liveMode) return
     if(existingElementId){
       
       
       const selectedElement = JSON.parse(JSON.stringify(state.editor.selectedElement));
       selectedElement.id = v4()
       dispatch({
         type: 'ADD_ELEMENT',
         payload: {
           containerId: id,
           elementDetails : selectedElement
         },
       });
       if (!e.ctrlKey && !e.metaKey) {
         dispatch({
           type: 'DELETE_ELEMENT',
           payload: {
             elementDetails: state.editor.selectedElement,
           },
         });
       }
 
 
     }else{
 
    
     const componentType = e.dataTransfer.getData('componentType') as EditorBtns
     console.log(componentType)
 
     switch (componentType) {
       case 'text':
         dispatch({
           type: 'ADD_ELEMENT',
           payload: {
             containerId: id,
             elementDetails: {
               content: { innerText: 'Text Element' },
               id: v4(),
               name: 'Text',
               styles: {
                 color: 'black',
                 ...defaultStyles,
               },
               type: 'text',
             },
           },
         });
         break;
       case 'container':
         dispatch({
           type: 'ADD_ELEMENT',
           payload: {
             containerId: id,
             elementDetails: {
               content: [],
               id: v4(),
               name: 'Container',
               styles: { ...defaultStyles },
               type: 'container',
             },
           },
         })
         break
       case "video":
         dispatch({
           type: 'ADD_ELEMENT',
           payload: {
             containerId: id,
             elementDetails: {
               content: { src: "https://www.youtube.com/embed/tpoOBvlvVl4?si=aj-JrXjfQUbvswEo" },
               id: v4(),
               name: 'Video',
               styles: {
                 color: 'black',
                 width: '100%',
                 height: 'auto',
                 objectFit: 'cover',
                 ...defaultStyles,
               },
               type: 'video',
             },
           }
         })
       case '2Col':
         dispatch({
           type: 'ADD_ELEMENT',
           payload: {
             containerId: id,
             elementDetails: {
               content: [
                 {
                   content: [],
                   id: v4(),
                   name: 'Container',
                   styles: { ...defaultStyles, width: '100%' },
                   type: 'container',
                 },
                 {
                   content: [],
                   id: v4(),
                   name: 'Container',
                   styles: { ...defaultStyles, width: '100%' },
                   type: 'container',
                 },
               ],
               id: v4(),
               name: 'Two Columns',
               styles: { ...defaultStyles, display: 'flex' },
               type: '2Col',
             },
           },
         })
         break
       case 'link':
         dispatch({
           type: 'ADD_ELEMENT',
           payload: {
             containerId: id,
             elementDetails: {
               content: {
                 innerText: 'Link Element',
                 href: '#',
               },
               id: v4(),
               name: 'Link',
               styles: {
                 color: 'black',
                 ...defaultStyles,
               },
               type: 'link',
             },
           },
         })
         break
         case 'navbar':
           dispatch({
             type: 'ADD_ELEMENT',
             payload: {
               containerId: id,
               elementDetails: {
                 content: {
                  
                 },
                 id: v4(),
                 name: 'navbar',
                 styles: {
                   
                 },
                 type: 'navbar',
               },
             },
           })
           break
 
 
 
     }
     }
 
 
   }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === '__body') return
    e.stopPropagation()
    e.dataTransfer.setData('existingElementId', id)
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  return (
    <div
      style={props.element.styles}
      className={clsx('relative p-4 transition-all', {
        'h-fit': type === 'container',
        'h-full': type === '__body',
        'm-4': type === 'container',
        '!border-blue-500':
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        '!border-solid':
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      id="innerContainer"
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== '__body' && !(state.editor.liveMode || state.editor.previewMode)}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, 'container')}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {Array.isArray(content) &&
        content.map((childElement) => (
          <RecursiveElement
            key={childElement.id}
            element={childElement}
          />
        ))}
         {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-blue-600  px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  )
}

export default TwoColumns