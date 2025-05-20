
import { Check } from 'lucide-react'
import React from 'react'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
// import { Button } from '../ui/button'

type Props = {
  price : number
  features : string[]
  isCurrent : boolean;
  onClick : ()=>void
  
}

const PricingCardSubscription = ({price, features ,isCurrent ,onClick}: Props) => {
    console.log(isCurrent)
  return (
    <Card className={`p-7 mt-10 md:w-auto w-full bg-themeBlack ${isCurrent ? "border-yellow-400 border-2 shadow-yellow-900 " : "border-themeGray"}`}>
    <div className="flex flex-col gap-2">
      <CardTitle>₹{price}/m</CardTitle>
      <CardDescription className="text-[#B4B0AE]">
       {price <= 0 ? " Great if you’re just getting started" : "Great for your businesses"}
      </CardDescription>
      <Link href="#" className="w-full mt-3">
        <Button
          variant="default"
          className="bg-[#333337] w-full rounded-2xl text-white hover:text-[#333337]"
          disabled={isCurrent}
          onClick={onClick}
        >
            {isCurrent && "Current Plan"}
          {!isCurrent && (price <=0  ? "Downgrade" : "Upgrade")}
        </Button>
      </Link>
    </div>
    <div className="flex flex-col gap-2 text-[#B4B0AE] mt-5">
      <p>Features</p>
     {
      features.map(feature=>(
        <span key={feature} className="flex gap-2 mt-3 items-center">
        <Check />
        {feature}
      </span>
      ))
     }
     
    </div>
  </Card>
  )
}

export default PricingCardSubscription