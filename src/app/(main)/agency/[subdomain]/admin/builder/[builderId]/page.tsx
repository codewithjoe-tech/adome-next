"use client"

import EditorProvider from '@/providers/editor/editor-provider'
import React from 'react'
import WebEditorNavigation from './_components/web-editor-navigation'
import WebEditorSidebar from './_components/web-editor-sidebar'
import WebEditor from './_components/web-editor'
import { useParams } from 'next/navigation'

const Page = () => {
  const params = useParams()
  const builderId = params?.builderId as string | undefined

  if (!builderId) return <p>Loading...</p> 

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-[20] bg-themeBlack overflow-hidden'>
      <EditorProvider webId={builderId} pageDetails={[]}>
        <WebEditorNavigation webId={builderId} pageDetails={{ id: builderId }} />
        <WebEditorSidebar />
        <div className="h-full flex justify-center">
          <WebEditor webPageId={builderId} />
        </div>
      </EditorProvider>
    </div>
  )
}

export default Page
