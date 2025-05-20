"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, minimum: 0.1, speed: 200 });

export default function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (!isTransitioning.current) {
      isTransitioning.current = true;
      NProgress.start();
    }

    const timer = setTimeout(() => {
      NProgress.done();
      isTransitioning.current = false;
    }, 300); 

    return () => {
      clearTimeout(timer);
      NProgress.done();
      isTransitioning.current = false;
    };
  }, [pathname, searchParams]);

  return <>{children}</>;
}