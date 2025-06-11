"use client"
import { getSubdomain } from '@/constants'
import { setAppInfo } from '@/Redux/slices/app-details'
import { setUserData } from '@/Redux/slices/user-details'
import { RootState } from '@/Redux/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from 'typescript-cookie'

type Props = {
    children: React.ReactNode
}


const LoginCheck = ({ children }: Props) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.user)
    const { schemaName } = useSelector((state: RootState) => state.app)
    const dispatch = useDispatch()




    
    useEffect(() => {
        // dispatch(setAppInfo({schemaName :  getSubdomain()}))

        const exp = getCookie(`${schemaName}_expiry`)
        if (exp && !isLoggedIn) {
            dispatch(setUserData({ isLoggedIn: true }))
        }
    }, [])

    return (
        <div>
          
            {children}
        </div>
    )
}

export default LoginCheck
