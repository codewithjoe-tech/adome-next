"use client"
import axiosInstance from '@/axios/public-instance'
import LoadingPage from '@/components/global/loading-page'
import { setAppInfo } from '@/Redux/slices/app-details'
import { setUserData } from '@/Redux/slices/user-details'
import { RootState } from '@/Redux/store'
import { notFound, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from 'typescript-cookie'


type Props = {
    children: React.ReactNode
}



const TenantAdminLoginCheck = ({ children }: Props) => {
    const router = useRouter()
    const { isLoggedIn } = useSelector((state: RootState) => state.user)
    const {     tenant,schemaName } = useSelector((state: RootState) => state.app)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)    

    const exp = getCookie(`${schemaName}_expiry`)
    useEffect(() => {
        if (exp && isLoggedIn) {
            setLoading(false);
        } else if (!exp) {
            console.log("Expiry cookie")
            router.push('/login');
        } else if (exp && !isLoggedIn) {
                dispatch(setUserData({ isLoggedIn: true }));
            // Check localStorage or session state
            // const storedUser = localStorage.getItem("user");
            // if (storedUser) {
            //     dispatch(setUserData(JSON.parse(storedUser)));
            // } else {
            // }
        }
    }, [exp, isLoggedIn]);
    


    return (
        <div>
          {
            loading ? <LoadingPage /> : children
          }
        </div>
    )
}

export default TenantAdminLoginCheck
