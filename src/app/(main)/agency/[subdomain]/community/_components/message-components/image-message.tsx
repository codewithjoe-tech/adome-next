'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/app/components/ui/spinner';

type ImageMessageProps = {
  imageUrl: string;
  alt?: string;
  isOptimistic?: boolean;
};

const ImageMessage: React.FC<ImageMessageProps> = ({
  imageUrl,
  alt = 'Image',
  isOptimistic = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-start gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className='hidden'>Image Preview</DialogTitle>
        <DialogTrigger asChild>
          <Card className="w-[300px] sm:w-[350px] cursor-pointer rounded-xl p-1 shadow-md bg-muted/50 ">
            <CardContent className="p-0 ">
              <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-lg">
                <Image
                  src={imageUrl}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 350px"
                />
              </AspectRatio>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-3xl p-4 bg-themeBlack">
          <AspectRatio ratio={16 / 9} >
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-contain rounded-xl"
              sizes="100vw"
            />
          </AspectRatio>
        </DialogContent>
      </Dialog>

      {isOptimistic && (
        <div className="mt-2">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ImageMessage;
