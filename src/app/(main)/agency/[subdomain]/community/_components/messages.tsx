"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatTimeAgo } from '@/utils'
import React from 'react'
import LinkedText from './message-components/linked-text'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'

type Props = {
    message : any
}

const Messages = ({message}: Props) => {
  const {id} = useSelector((state:RootState)=>state.user.user)
  return (
          <div  className="mb-4 flex gap-3 items-start">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={message.profile_pic} alt={message.full_name} />
                  <AvatarFallback>
                    {message.full_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-primary">{message?.user === id ? "You" : message?.full_name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      { formatTimeAgo(message.created_at)}
                    </span>
                  </div>
                 {/* { (message?.contenttype ==='1' && !message?.link) && <p className={`${ message?.isOptimistic ? "text-gray-400" :"text-foreground"}`}>{message?.content}</p>} */}
                 { (message?.contenttype ==='1' ) && (<LinkedText message={message?.content} isOptimistic ={message?.isOptimistic} link={message.link}/>)}
                </div>
              </div>
  )
}

export default Messages