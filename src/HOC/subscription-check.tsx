"use client"
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/Redux/store'; 
import { ComponentType, useEffect } from 'react';

const withSubscriptionCheck = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithSubscriptionCheck = (props: P) => {
    const tenant = useSelector((state: RootState) => state.app.tenant);
    const router = useRouter();

    const subscriptionPlan = tenant?.subscription_plan || '1';


      if (subscriptionPlan === '1') {
        router.replace('/404');
      }
 

    if (subscriptionPlan === '1') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithSubscriptionCheck.displayName = `WithSubscriptionCheck(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithSubscriptionCheck;
};

export default withSubscriptionCheck;