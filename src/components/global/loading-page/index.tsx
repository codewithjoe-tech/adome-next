import { Spinner } from '@/app/components/ui/spinner'
import React from 'react'

type Props = {}

const LoadingPage = (props: Props) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center overflow-hidden">
        <Spinner size={'large'} className='text-themeTextWhite' />
    </div>
  )
}

export default LoadingPage