"use client"

import withSubscriptionCheck from '@/HOC/subscription-check';
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='text-muted-foreground'>Coming Soon...</div>
  )
}

export default withSubscriptionCheck(React.memo(page));