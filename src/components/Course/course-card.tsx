"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowRight, Edit, Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { loadRazorpay } from "@/constants";
import axiosInstance from "@/axios/public-instance";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  title: string;
  thumbnail: string;
  content: string;
  onDelete?: (id: number) => void;
  id: number;
  is_admin?: boolean;
  sm?: boolean;
  price?: string;
  onClick : (id:number)=>void,
  owned ? : boolean
};

const CourseCards = ({
  id,
  title,
  thumbnail,
  content,
  onDelete,
  is_admin = false,
  sm,
  price,
  onClick ,
  owned= false
}: Props) => {
  const router = useRouter();
  const {schemaName , appname ,tenant } = useSelector((state:RootState)=>state.app)
  const {user } = useSelector((state:RootState)=>state.user.user)
  // const res = loadRazorpay()
  // if (!res) {
  //   alert("Razorpay SDK failed to load");
  //   return;
  // }
  const queryClient = useQueryClient()
  const handlePayment = async ()=>{
    const response = await axiosInstance.post(`payment/${schemaName}/create-order` , {
      course_id : id
    })
    const { razorpay_order_id, order_amount: razorpayAmount, currency, razorpay_key_id , order_id } = response.data;
    const options = {
      key: razorpay_key_id,
      amount: razorpayAmount,
      currency,
      name: appname,
      description: tenant.description?.slice(0 , 30) + "...",
      order_id: razorpay_order_id,
      handler: async function (response: any) {
        // TODO: Step 3 - verify on server
      const serverResponse =   await axiosInstance.post(`payment/${schemaName}/verify-order`, {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        // console.log(serverResponse)
        onClick(id);


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
    <Card
      className={`relative group bg-themeBlack w-full rounded-lg shadow-2xl overflow-hidden cursor-pointer ${
        sm ? "max-w-[280px]" : "max-w-[360px]"
      }`}
    >
      {is_admin && (
        <Button
        onClick={() => {
          router.push(`/admin/courses/${id}/edit`)
        }}
        className="absolute top-3 right-3 z-10 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        variant="default"
        >
        <Edit className="w-4 h-4" />
        </Button>
      )}

{is_admin && (
  <Button
  onClick={() => {
    onDelete && onDelete(id);
  }}
  className="absolute top-3 right-12 z-10 p-2 opacity-0  group-hover:opacity-100 transition-opacity duration-700"
  variant="default"
  >
  <Trash2 className="w-4 h-4" />
        </Button>
      )}


      <CardHeader className="p-0" onClick={(e)=>{
        onClick(id)
      }}>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={thumbnail}
            alt="Thumbnail"
            fill
            className="rounded-t-lg object-cover object-top"
          />
        </AspectRatio>
        <div className="p-4">
          <CardTitle className="text-lg font-bold">{title && title.slice(0 , 30)} {title.length > 30 && "..."}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        <CardDescription>
          {content && content.slice(0, 70)} {content.length > 70 && "..."}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex justify-between px-4 pb-4 mt-4 text-sm text-gray-400">
        
          <div className="flex flex-col items-end text-right">
            
       { !owned ?    <Button
              size="sm"
              onClick={(e) => {
        e.stopPropagation()

                // console.log("working")
                handlePayment()
              }}
              className="mt-1 bg-transparant text-green-500 hover:bg-green-500 hover:text-themeTextWhite "
            >
               ₹{price} - Buy Now <ArrowRight />
            </Button> : (
              <Button
              size="sm"
              onClick={(e) => {
        e.stopPropagation()

               router.push('/courses/watch/' + id)
              }}
              className="mt-1 bg-transparant text-green-500 hover:bg-green-500 hover:text-themeTextWhite "
            >
               Watch Now <ArrowRight />
            </Button>
            )}
          </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCards;
