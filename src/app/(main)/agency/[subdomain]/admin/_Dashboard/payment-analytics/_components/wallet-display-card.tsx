import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
    data  : {
        amount : number;
        text : string ;
    }
}

const WalletDisplayCard = ({data}: Props) => {
  return (
    <Card className="text-center h-96">
      <CardHeader>
        <CardTitle>{data.text}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-4xl font-bold">{data.amount}</div>
      </CardContent>
    </Card>
  )
}

export default WalletDisplayCard
