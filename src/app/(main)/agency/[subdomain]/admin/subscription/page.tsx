
"use client"
import { loadRazorpay, prices } from '@/constants'
import React, { useEffect } from 'react'
import PricingCardSubscription from './_components/pricing-card'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { toast } from 'sonner'
import axiosInstance from '@/axios/public-instance'
import { setAppInfo } from '@/Redux/slices/app-details'

type Props = {}

const page = (props: Props) => {
  const app = useSelector((state: RootState) => state.app)
  const { user } = useSelector((state: RootState) => state.user)
  const { tenant, appname, schemaName, logo } = app;
  const dispatch = useDispatch()

  useEffect(() => {
    loadRazorpay().then((res) => {
      if (!res) {
        toast.error("Failed to load Razorpay SDK. Please try again.");
      } else {
        console.log("Razorpay SDK loaded successfully");
      }
    });
  }, []);

  const handleSubscription = async (planType: '1' | '2') => {


    try {
      const response = await axiosInstance.post(
        `payment/${schemaName}/create-subscription`,
        { plan_type: planType },

      );

      const { plan, subscription_id, razorpay_key } = response.data;
      console.log(response)

      if ((response.status >= 200 && response.status < 300) && plan === '1') {
        toast.success('Success!', {
          description: 'Free plan activated successfully!'

        });
        // const updatedTenant = {
        //   ...app.tenant,
        //   subscription_plan: '1',
        // }
        // // setCurrentPlan('FREE');
        // // setSubscriptionStatus('active');
        // // setBillingCycleEnd(null);
        // // setGracePeriodEnd(null);
        // // dispatch(setAppInfo())
        // dispatch(setAppInfo({
        //     tenant: updatedTenant,
        //     appname: app.appname,
        //     schemaName: app.schemaName,
        //     logo: app.logo,
        // }));
        dispatch(setAppInfo({
          tenant: { ...tenant, subscription_plan: '1' },
          appname,
          schemaName,
          logo,
        }))

      } else if ((response.status >= 200 && response.status < 300) && plan === '2') {
        const options = {
          key: razorpay_key,
          subscription_id: subscription_id,
          name: 'Adome',
          description: 'Premium Plan Subscription',
          handler: async (response: any) => {
            try {
              const verifyResponse = await axiosInstance.post(
                // 'http://localhost:8000/api/subscriptions/verify-payment/',
                `payment/${schemaName}/verify-subscription`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                }
              );
              toast.success("Success!" ,{ description : verifyResponse.data.message});
              // setCurrentPlan('PREMIUM');
              // setSubscriptionStatus('active');
              dispatch(setAppInfo({
          tenant: { ...tenant, subscription_plan: '2' },
          appname,
          schemaName,
          logo,
        }))
              // setBillingCycleEnd(verifyResponse.data.billing_cycle_end);
            } catch (error: any) {
              toast.error(`Error: ${error.response?.data?.message || error.message}`);
            }
          },
          prefill: {
            name: user?.user?.full_name,
            email: user?.user?.email,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', (response: any) => {
          toast.error(`Payment failed: ${response.error.description}`);
        });
        paymentObject.open();
      }
    } catch (error: any) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };



  const cancelSubscription = async () => {
    const response = await axiosInstance.post(`payment/${schemaName}/cancel-subscription`)
    const data = response.data
    if (response.status >= 200 && response.status < 300) {
      toast.success('Success!', {
        description: data?.message
      })
      dispatch(setAppInfo({
          tenant: { ...tenant, subscription_plan: '1' },
          appname,
          schemaName,
          logo,
        }))
    } else {
      toast.error('Error!', {
        description: data?.message
      })
    }

  }




  const onClick = () => {
    if ((app?.tenant?.subscription_plan) === '1') {
      handleSubscription('2')
    } else {
      cancelSubscription()
    }
  }

  return (
    <div className="w-full  gap-3" id="pricing">


      <div className="flex gap-3">
        {
          prices.map(features => (
            <PricingCardSubscription key={features.price}  {...features} isCurrent={app?.tenant?.subscription_plan as string === features.plan_type} onClick={onClick} />

          ))
        }

      </div>
    </div>
  )
}

export default page