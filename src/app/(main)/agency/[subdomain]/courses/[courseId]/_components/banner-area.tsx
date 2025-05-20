import Image from 'next/image'
import React from 'react'
import { AspectRatio } from "@/components/ui/aspect-ratio"
type Props = {
  title : string,
  thumbnail : string
}

const BannerArea = ({title, thumbnail}: Props) => {
  console.log(thumbnail)
  return (
    
     <div className="relative h-[400px] w-full overflow-hidden">
<div className="relative w-full h-full">
  <AspectRatio ratio={16 / 9}>
    <div className="relative w-full h-full">
      {thumbnail && (
        <Image
          src={thumbnail}
          alt="Thumbnail"
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
    </div>
  </AspectRatio>
</div>

          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2 text-gradient">{title}</h1>
            {/* <p className="text-lg">Learn to build modern web applications with React, Tailwind, and more.</p> */}
          </div>
        </div>
  )
}

export default BannerArea