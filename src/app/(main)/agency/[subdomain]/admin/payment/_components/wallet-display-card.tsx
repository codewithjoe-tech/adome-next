import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';

type Props = {
    data  : {
        amount : number;
        text : string ;
    }
}

const WalletDisplayCardPayment = ({data}: Props) => {
  return (
    <Card className="text-center h-96">
      <CardHeader>
        <CardTitle>{data.text}</CardTitle>
       {
        data.text  === "Withdrawable Amout" && (
            <CardDescription>You can only withdraw the amount only 7 days after an order and the total withdrawal money becomes more than 500</CardDescription>
        )
       }
      </CardHeader>
      <CardContent className="flex flex-col   items-center justify-center h-full">
        <div className="text-4xl font-bold">{data.amount}</div>
        {
            data.text === "Withdrawable Amout" &&(
                <Button disabled={data?.amount<500}>Withdraw</Button>
            )
        }
      </CardContent>
    </Card>
  )
}

export default WalletDisplayCardPayment
