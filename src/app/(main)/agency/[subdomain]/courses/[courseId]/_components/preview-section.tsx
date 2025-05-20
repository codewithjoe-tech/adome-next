"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  preview: string 
  price : string
  owned : boolean,
  id : string,
  handlePayment : () => void
}

const PreviewSection = ({ preview,price ,owned ,id , handlePayment}: Props) => {
  const isDirectVideo = preview && preview.startsWith('http')
  const router = useRouter()

  return (
    <div className="sticky top-4 bg-themeGray/70 rounded-lg shadow-lg p-6">
      <div className="relative mb-4">
        {isDirectVideo ? (
          <video
            src={preview}
            controls
            autoPlay
            className="w-full rounded-md"
          />
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${preview}?autoplay=1`}
            className="w-full aspect-video rounded-md"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>

      <div className="text-2xl font-bold mb-4">₹{price}</div>
      {/* <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90">
        Add to Cart
      </button> */}

    { !owned ?  <Button onClick={handlePayment}  className='w-full'>
        Buy Now
      </Button> :(
        <Button 
        onClick={()=>{
          router.push(`/courses/watch/${id}`)
        }}
        className='w-full'>
        Watch Now
      </Button> 
      )}
      {/* <p className="text-sm text-muted-foreground mt-4 text-center">30-Day Money-Back Guarantee</p> */}
    </div>
  )
}

export default PreviewSection
