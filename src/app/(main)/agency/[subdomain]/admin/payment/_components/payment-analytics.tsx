import React from 'react'
// 
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import axiosInstance from '@/axios/public-instance'
import { Separator } from '@/components/ui/separator'
import WalletDisplayCard from '../../_Dashboard/payment-analytics/_components/wallet-display-card'
import PaymentCard from '../../_Dashboard/payment-analytics/_components/payments-card'
import WalletDisplayCardPayment from './wallet-display-card'
// import WalletDisplayCard from './_components/wallet-display-card'

// import PaymentCard from './_components/payments-card'


type Props = {}

const PaymentAnalyticsPayment = (props: Props) => {
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const {data : walletData , isLoading : walletLoading , isError : walletError} = useQuery({
    queryKey : ['get-wallet'],
    queryFn : async ()=>{
        const response = await axiosInstance.get(`payment/${schemaName}/get-wallet`)
        // console.log(response.data)
        return response.data
    }
  })





  
  const {data : previousOrderLogs , isLoading : previousOrderLoading , isError : previousOrderError} = useQuery({
    queryKey : ['get-previous_orders'],
    queryFn : async ()=>{
        const response = await axiosInstance.get(`payment/${schemaName}/previous-orders`)
        // console.log(response.data)
        return response.data
    }
  })





  return (
    <div className="w-full">

    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
      <div className="w-full max-w-xxl">
      <WalletDisplayCardPayment data={{amount : walletData?.total_amount,text : "Total Amout"}} />
      </div>
      <div className="w-full max-w-xxl">
      <WalletDisplayCardPayment data={{amount : walletData?.withdrawal_amount,text : "Withdrawable Amout"}} />
        {/* <UserLine datas={userSixMonths} /> */}
      </div>
     
    </section>
    <Separator className='mt-10' />
    <section className='mt-8 ml-3 mb-16'>

        <h3 className='text-3xl'>Order Placed Log : </h3>
        <div className='space-y-4 mt-5 max-h-96 max-w-[50%] overflow-y-auto'>
        {/* UserJoinedCard */}
         {
            previousOrderLogs && previousOrderLogs.map((order:any)=>(
                <PaymentCard key={order.id} paymentDetails={order} />
            ))
         }
        </div>
        {/**/}
    </section>
      </div>
  )
}

export default PaymentAnalyticsPayment
