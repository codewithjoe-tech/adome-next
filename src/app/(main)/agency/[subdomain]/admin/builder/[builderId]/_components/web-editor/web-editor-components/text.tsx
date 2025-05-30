"use client"

import { Badge } from '@/components/ui/badge'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React from 'react'

type Props = {
    element : EditorElement
}

const TextComponent = (props: Props) => {
    const {dispatch , state } = useEditor()
    const handleDragStart = (e: React.DragEvent, type: string) => {
        if (type === '__body') return
        
        e.dataTransfer.setData('existingElementId', props.element.id)
      }

    const handleDeleteElement = () => {
        dispatch({
          type: 'DELETE_ELEMENT',
          payload: { elementDetails: props.element },
        })
      }
      const styles = props.element.styles
    
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
    style={styles}
    draggable = {!(state.editor.liveMode || state.editor.previewMode)}
    className={clsx(
        'p-[2px] w-full m-[5px] relative text-[16px] transition-all',
        {
          '!border-blue-500':
            state.editor.selectedElement.id === props.element.id,

          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
      onClick={handleOnClickBody}
      onDragStart={(e)=>handleDragStart(e , 'text')}
      >
          {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] bg-blue-600 text-white -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}

<span
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement
          dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
              elementDetails: {
                ...props.element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          })
        }}
      >
        {!Array.isArray(props.element.content) &&
          props.element.content.innerText}
      </span>

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

export default TextComponent