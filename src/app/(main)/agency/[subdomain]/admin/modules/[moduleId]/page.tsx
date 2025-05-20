import withSubscriptionCheck from '@/HOC/subscription-check';
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>page</div>
  )
}

export default withSubscriptionCheck(React.memo(page));