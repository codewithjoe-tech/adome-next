import React from 'react'
// 
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import axiosInstance from '@/axios/public-instance'
import { Separator } from '@/components/ui/separator'
import UserTotalCard from './_components/user-total-card'
import UserLine from './_components/user-line'
import UserJoinedCard from './_components/user-joined-card'

type Props = {}

const UserAnalytics = (props: Props) => {
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const {data : totalUser , isLoading : totalUserLoading , isError : totalUserError} = useQuery({
    queryKey : ['totalUser'],
    queryFn : async ()=>{
        const response = await axiosInstance.get(`user/${schemaName}/total-users`)
        console.log(response.data)
        return response.data
    }
  })


  const {data : userSixMonths , isLoading : userSixMonthLoading , isError : userSixMonthError} = useQuery({
    queryKey : ['usersJoinedInSixMonths'],
    queryFn : async()=>{
        const response = await axiosInstance.get(`user/${schemaName}/user-analytics-joined`)
        console.log(response.data)
        return response.data
    }
  })


  const {data: userJoiningLog , isLoading : userJoiningIsLoading , isError : userJoiningIsError} = useQuery({
    queryKey :['userjoininglog'],
    queryFn : async ()=>{
        const response = await axiosInstance.get(`user/${schemaName}/user-joining-log`)
        console.log(response.data)
        return response.data
    }
  })


  return (
    <div className="w-full">

    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
      <div className="w-full max-w-xxl">
      <UserTotalCard totalUsers={totalUser?.total_users}/>
      </div>
      <div className="w-full max-w-xxl">
        <UserLine datas={userSixMonths} />
      </div>
      {/* <div className="w-full max-w-xxl">
        <CoursePie />
      </div>
      <div className="w-full max-w-xxl">
      <CoursePie />
      </div> */}
    </section>
    <Separator className='mt-10' />
    <section className='mt-8 ml-3 mb-16'>

        <h3 className='text-3xl'>User Joining Log : </h3>
        <div className='space-y-4 mt-5 max-h-96 max-w-[50%] overflow-y-auto'>
        {/* UserJoinedCard */}
        {userJoiningLog && userJoiningLog.length < 1  && (
            "No data available"
        )}
         {userJoiningLog && userJoiningLog.map((user:any)=>{
                  return  <UserJoinedCard key={user?.id} userDetails={user} /> 
                })}
        </div>
        {/**/}
    </section>
      </div>
  )
}

export default UserAnalytics
