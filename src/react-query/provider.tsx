"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"




import React from 'react'

type Props = {
    children: React.ReactNode
}

const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, 
        gcTime: 15 * 60 * 1000,
      },
    },
  });


//   const localstoragePersister = 
  

const ReactQueryProvider = ({children}: Props) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
 
}

export default ReactQueryProvider