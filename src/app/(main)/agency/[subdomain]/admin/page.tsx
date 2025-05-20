"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseAnalytics from './_Dashboard/course-analytics'
import UserAnalytics from './_Dashboard/user-analytics'
import PaymentAnalytics from './_Dashboard/payment-analytics'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'


type Props = {}

const page = (props: Props) => {
  const [selectedTab, setSelectedTab] = useState('users')
  const {tenant} = useSelector((state:RootState)=>state.app)
  useEffect(() => {
   console.log(selectedTab)
  }, [selectedTab])
  
 
  return (
 <>
 <Tabs defaultValue={tenant.subscription_plan==='1' ? 'users' : 'course'} onValueChange={(value)=>setSelectedTab(value)} className="w-full">
  <TabsList>
{  tenant.subscription_plan === '2' &&  <>
    <TabsTrigger value="course">Courses</TabsTrigger>
    <TabsTrigger value="payments">Payments</TabsTrigger>
    <TabsTrigger value="users">Users</TabsTrigger>
    </>}
  </TabsList>
  <TabsContent value="course">

  <CourseAnalytics />
  </TabsContent>
  <TabsContent value="payments">
  <PaymentAnalytics />
  </TabsContent>
  <TabsContent value="users">
  <UserAnalytics />
  </TabsContent>
</Tabs>
 </>
  )
}

export default page