"use client"

import axiosInstance from '@/axios/public-instance'
import EditorProvider from '@/providers/editor/editor-provider'
import { RootState } from '@/Redux/store'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import WebEditor from './admin/builder/[builderId]/_components/web-editor'
import Navbar from '@/components/navbar'
import NavbarClone from '@/components/navbar/nav-clone'

type Props = {}

const page = (props: Props) => {
  
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const fetchLandingPage = async ()=>{
    const response = await axiosInstance.get(`builder/${schemaName}/tenant-default-website`)
    return response?.data
  }

  const { data, isLoading, isError } = useQuery<any, Error>({
    queryKey: ['landing-page'],
    queryFn: fetchLandingPage,
    retry: false,
  });
  
  
  useEffect(() => {
   // console.log(isError)
  }, [isError])
  
  return (
    <div className="h-screen overflow-hidden">
      {(isError && !data) && (
        <NavbarClone />
      )}
    {data && (
      <EditorProvider  webId={data.id} pageDetails={data.web_data}>
        <WebEditor webPageId={data.id} liveMode={true} />
      </EditorProvider>
    )}
  </div>
  )
}

export default page