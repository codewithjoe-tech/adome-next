"use client"

import React, { useState } from 'react';
import { boolean } from 'zod';

type Props = {
  message: string;
  link?: any
  isOptimistic: null | boolean
  
};

const LinkedText = ({ message, link }: Props) => {
    console.log(link)

  // Extract URL from link prop if it exists
  const linkUrl = typeof link === 'string' ? link : link?.url || null;

  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Function to process message and wrap URLs in <a> tags
  const renderMessageWithLinks = () => {
    // If no URLs in message and no link prop, return plain message
    if (!urlRegex.test(message) && !linkUrl) {
      return <span>{message}</span>;
    }

    // If link prop exists, prioritize it
    if (linkUrl) {
      const parts = message.split(linkUrl);
      return (
        <>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < parts.length - 1 && (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {linkUrl}
                </a>
              )}
            </React.Fragment>
          ))}
        </>
      );
    }

    // Otherwise, find URLs in the message
    const parts = message.split(urlRegex);
    return (
      <>
        {parts.map((part, index) =>
          urlRegex.test(part) ? (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {part}
            </a>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  // Render WhatsApp-like card for link preview
  const renderLinkCard = () => {
    // if (!linkUrl || !link || (!link.title && !link.description && !link.image)) {
    //   return null;
   if(!(link?.image)) return null
     const [imageError, setImageError] = useState(false);
    // }

    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block max-w-sm rounded-lg border border-border bg-card p-3 shadow-sm hover:bg-card/90"
      >
        <div className="flex items-start gap-3">
          {link.image && !imageError && (
            <img
              src={link.image}
              alt="Link preview"
              onError={() => setImageError(true)}
              className="h-16 w-16 rounded-md object-cover"
            />
          )}
          <div className="flex-1">
            {link.title && (
              <p className="line-clamp-2 font-semibold text-foreground">{link.title}</p>
            )}
            {link.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{link.description}</p>
            )}
            <p className="mt-1 text-xs text-blue-500 truncate">{linkUrl}</p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="text-foreground">
      {renderLinkCard()}
      {renderMessageWithLinks()}
    </div>
  );
};

export default LinkedText;