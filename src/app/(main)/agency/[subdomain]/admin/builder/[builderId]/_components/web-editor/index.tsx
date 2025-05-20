'use client'

import { Button } from '@/components/ui/button'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { EyeOff } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import Recursive from './web-editor-components/recursive'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/axios/public-instance'
import { Spinner } from '@/app/components/ui/spinner'
import Navbar from '@/components/navbar'

type Props = {
  webPageId: string
  liveMode?: boolean
}

const WebEditor = ({ webPageId, liveMode }: Props) => {
  const { state, dispatch } = useEditor()
  const { schemaName } = useSelector((state: RootState) => state.app)
  const hasLoadedData = useRef(false)

  const fetchWebsiteData = async (webId: string) => {
    const response = await axiosInstance.get(
      `builder/${schemaName}/builder-element/${webId}`
    )
    return response.data
  }

  const { data, isLoading } = useQuery({
    queryKey: ['website', webPageId],
    queryFn: () => fetchWebsiteData(webPageId),
    enabled: !!webPageId && !!schemaName,
  })

  // Load editor data once
  useEffect(() => {
    if (!data || hasLoadedData.current) return

    dispatch({
      type: 'LOAD_DATA',
      payload: {
        elements: data.web_data,
        withLive: !!liveMode,
      },
    })

    hasLoadedData.current = true
  }, [data, liveMode, dispatch])

  // Set live mode toggle
  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: 'TOGGLE_LIVE_MODE',
        payload: {
          value: true,
        },
      })
    }
  }, [liveMode, dispatch])
  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: 'TOGGLE_LIVE_MODE',
        payload: {
          value: true,
        },
      });
    }
  }, [liveMode, dispatch]);

  // Handle Delete key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        (e.altKey || e.metaKey) &&
        !state.editor.liveMode
      ) {
        const selectedElement = state.editor.selectedElement;
        if (selectedElement.id && selectedElement.type !== '__body') {
          dispatch({
            type: 'DELETE_ELEMENT',
            payload: {
              elementDetails: selectedElement,
            },
          });
       
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.editor.liveMode, state.editor.selectedElement, dispatch]);

  const handleClick = () => {
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {},
    })
  }

  const handleUnpreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
    dispatch({ type: 'TOGGLE_LIVE_MODE' })
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size={'large'} />
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'use-automation-zoom-in h-full overflow-y-auto overflow-x-hidden mr-[385px] transition-all rounded-md',
        {
          '!p-0 !mr-0':
            state.editor.previewMode === true || state.editor.liveMode === true,
          '!w-[850px]': state.editor.device === 'Tablet',
          '!w-[420px]': state.editor.device === 'Mobile',
          'w-full': state.editor.device === 'Desktop',
        }
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 p-[2px] fixed top-0 left-0 z-[100]"
          onClick={handleUnpreview}
        >
          <EyeOff />
        </Button>
      )}
      {/* {state.editor.elements?.length < 1 && (
        <Navbar />
      )} */}
      {state.editor.elements?.length > 0 &&
        state.editor.elements.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
    </div>
  )
}

export default WebEditor
