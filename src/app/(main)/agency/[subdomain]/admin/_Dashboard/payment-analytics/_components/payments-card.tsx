import React from 'react'
import { formatTimeAgo } from "@/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
    paymentDetails : any
}

const PaymentCard = ({paymentDetails}: Props) => {
  return (
    <Card className="flex items-center max-w-3xl gap-4 p-4">
    {/* <Image
      src={courseDetails.profile_pic}
      alt={courseDetails.full_name}
      width={48}
      height={48}
      className="rounded-full object-cover"
    /> */}
    <Avatar>
<AvatarImage src={paymentDetails && paymentDetails?.profile_pic}/>
<AvatarFallback>CN</AvatarFallback>
</Avatar>

    <CardContent className="p-0">
      <p className="text-xl font-medium ">
        {paymentDetails.user}{" has "}
        <span className="font-normal">
        has payed ₹{paymentDetails.order_amount} at  {new Date(paymentDetails?.order_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}
        </span>{" "}
      
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {paymentDetails.order_date && (formatTimeAgo(paymentDetails.order_date))}
      </p>
    </CardContent>
  </Card>
  )
}

export default PaymentCard