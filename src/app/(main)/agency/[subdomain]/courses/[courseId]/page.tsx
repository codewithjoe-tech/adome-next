"use client"
import React, { useState } from 'react'
import BannerArea from './_components/banner-area';
import CourseDetails from './_components/course_details';
import PreviewSection from './_components/preview-section';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import axiosInstance from '@/axios/public-instance';
import { loadRazorpay } from '@/constants';
import withSubscriptionCheck from '@/HOC/subscription-check';

type Props = {
  params : Promise< {courseId : string} >
}

const Page = ({params}: Props) => {
  const { courseId } = React.use(params)

  const {schemaName , appname ,tenant } = useSelector((state:RootState)=>state.app)
    const {user } = useSelector((state:RootState)=>state.user.user)
  const {data , isLoading , isError} = useQuery({
    queryKey : ['getCourse' , courseId],
    queryFn : async ()=>{
        const res = await axiosInstance.get(`course/${schemaName}/preview-course/${courseId}`);
        // console.log(res.data)
        return res.data
    }
  })

  console.log(data)
   const res = loadRazorpay()
    if(!res){
      alert("Razorpay loading error ")
    }
  const handlePayment = async ()=>{
    const response = await axiosInstance.post(`payment/${schemaName}/create-order` , {
      course_id : courseId
    })
    const { razorpay_order_id, order_amount: razorpayAmount, currency, razorpay_key_id , order_id } = response.data;
    console.log(response.data)
    const options = {
      key: razorpay_key_id,
      amount: razorpayAmount,
      currency,
      name: appname,
      description: tenant.description?.slice(0 , 30) + "...",
      order_id: razorpay_order_id,
      handler: async function (response: any) {
        // TODO: Step 3 - verify on server
       const verifyresponse =  await axiosInstance.post(`payment/${schemaName}/verify-order`, {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        console.log(verifyresponse)

        alert("Payment successful!");
      },
      prefill: {
        name: user.full_name,
        email: user.email,
      },
      theme: {
        color: '#09090B',
      },

    };
    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();


  }

    
  return (
    <div className="min-h-screen bg-themeBlack">
   
    <BannerArea title={data?.title} thumbnail={data?.thumbnail} />

    {/* Main Content */}
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Left Section: Course Details */}
     

      <CourseDetails content={data?.content} htmlContent={data?.htmlContent} JsonContent={data?.JsonContent} module={data?.modules} />
      {/* Right Section: Video Preview and Purchase Card */}
      <div className="md:w-1/3">
      <PreviewSection preview={data?.preview_video} price ={data?.price} owned={data?.owned} id={courseId} handlePayment={handlePayment} />
      </div>
    </div>
  </div>
  )
}

export default withSubscriptionCheck(React.memo(Page));