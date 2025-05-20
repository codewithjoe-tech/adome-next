"use client"
import { defaultStyles, EditorBtns } from '@/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { v4 } from 'uuid';



import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge';
import Recursive from './recursive';
import { Trash } from 'lucide-react';

type Props = {
  element: EditorElement
}

const Container = ({ element }: Props) => {
  const { id, content, name, styles, type } = element
  const { state, dispatch } = useEditor()
  const [isDragging, setIsDragging] = useState(false)

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

    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(!state.editor.liveMode){

      setIsDragging(true)
    }
    console.log(isDragging)
    
  }

  const handleDragLeave = (e:React.DragEvent) => {
    e.stopPropagation()
    setIsDragging(false)
  }
  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === '__body') return
    e.dataTransfer.setData('existingElementId', id)
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  return (
    <div
      style={styles}
      className={clsx('relative p-4 transition-all group', {
        '!border-blue-400 !border-solid !border-4 shadow-lg': isDragging,
        'scale-[103%] duration-200' : isDragging && type!=='__body',
        'max-w-full w-full': type === 'container' || type === '2Col',
        'h-fit': type === 'container',
        'h-full': type === '__body',
        'overflow-y-scroll ': type === '__body',
        'flex flex-col md:!flex-row': type === '2Col',
        '!border-blue-500':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== '__body',
        '!border-yellow-400 !border-4':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === '__body',
        '!border-solid':
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode ,
        'pb-96' : (!state.editor.liveMode && type==="__body")
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      draggable = {!(state.editor.liveMode || state.editor.previewMode)}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, 'container')}
    >
      <Badge
        className={clsx(
          'absolute -top-[23px] -left-[1px] bg-blue-500 rounded-none rounded-t-lg hidden',
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive
            key={childElement.id}
            element={childElement}
          />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== '__body' && (
          <div className="absolute bg-blue-500 px-2.5 py-1 text-xs font-bold cursor-pointer -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash
              size={16}
              onClick={handleDeleteElement}

            />
          </div>
        )}
    </div>
  )
}

export default Container