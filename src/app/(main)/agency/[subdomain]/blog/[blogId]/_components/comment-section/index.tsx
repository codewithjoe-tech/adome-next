'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AutosizeTextarea } from '@/components/ui/text-area'
import { useComments } from '@/hooks/blog-comments'
import { RootState } from '@/Redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

type Props = {
  userDetails: {
    profile_pic: string
    full_name: string
  }
  contentId: string
}

const CommentSection = ({ userDetails, contentId }: Props) => {
  const {user , isLoggedIn } = useSelector((state:RootState)=>state.user)
  const [newComment, setNewComment] = useState('')
  const {
    comments,
    addComment,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    deleteComment,
  } = useComments(contentId, userDetails)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      addComment.mutate(newComment)
      setNewComment('')
    }
  }

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>

      <form onSubmit={handleSubmit} className="flex items-start gap-4 mb-10">
       {isLoggedIn && <Avatar className="h-10 w-10">
          <AvatarImage src={user?.user?.profile_pic} />
          <AvatarFallback>{user?.user?.full_name?.[0] ?? 'U'}</AvatarFallback>
        </Avatar>}

        <div className="flex-1 space-y-2">
      {  isLoggedIn ?  <AutosizeTextarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-xl border border-border bg-themeBlack px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            maxHeight={200}
          />
        :(
          <p className='text-muted-foreground'>Login to comment</p>
        )
        }

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-primary text-sm font-medium px-5 py-2 rounded-md hover:bg-primary/90 transition"
            >
              Post
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-8">
        {comments.length < 1 && isLoggedIn && (
          <p className="text-muted-foreground">Be the first to comment on this amazing blog.</p>
        )}

        {comments.map((comment) => {
          const isOwner = comment.user.profile_pic === userDetails.profile_pic // 🔥

          return (
            <div key={comment.id} className="flex items-center gap-4 relative group">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.profile_pic} />
                <AvatarFallback>{comment.user.full_name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 rounded-xl bg-themeBlack px-5 py-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold">{comment.user.full_name}</p>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>

              {isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-xs text-destructive"
                  onClick={() => deleteComment.mutate(comment.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          )
        })}

        {hasNextPage && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-md px-6 py-2 text-sm"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More Comments'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection
