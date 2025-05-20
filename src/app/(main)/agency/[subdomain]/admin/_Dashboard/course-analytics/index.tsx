import React from 'react'
import CoursePie from './_components/course-pie'
import CourseBar from './_components/course-bar'
import CourseLine from './_components/course-line'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import axiosInstance from '@/axios/public-instance'
import { Separator } from '@/components/ui/separator'
import CourseBoughtCard from './_components/course-bought-card'
import { courseBought } from '@/types'

type Props = {}

const CourseAnalytics = (props: Props) => {
  const {schemaName} = useSelector((state:RootState)=>state.app)


  const {data : courseSales , isLoading : courseSalesLoading , isError  : courseIsError} = useQuery({
    queryKey : ['courseSales'],
    queryFn : async ()=>{
      const response = await axiosInstance.get(`course/${schemaName}/course-sales`)
      console.log(response.data)
      return response.data
    }
  })

  const {data : courseSixMonthSales , isLoading : courseSixMonthLoading , isError : courseSixMonthIsError} = useQuery({
    queryKey : ['courseSixMonthSales'],
    queryFn : async ()=>{
      const response = await axiosInstance.get(`course/${schemaName}/course-six-month`)
      return response.data
    }
  })

  const {data : courseBought , isLoading : courseBoughtIsLoading , isError : courseBoughtIsError} = useQuery({
    queryKey : ['courseBought'],
    queryFn : async ()=>{
      const response = await axiosInstance.get(`course/${schemaName}/course-bought`)
      console.log(response.data)
      return response.data
    }
  })

  return (
    <div className="w-full">

    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
      <div className="w-full max-w-xxl">
        <CourseBar courseSales={courseSales} />
      </div>
      <div className="w-full max-w-xxl">
        <CourseLine data={courseSixMonthSales} />
      </div>
      {/* <div className="w-full max-w-xxl">
        <CoursePie />
      </div>
      <div className="w-full max-w-xxl">
      <CoursePie />
      </div> */}
    </section>
    <Separator className='mt-10' />
    <section className='mt-8 ml-3'>

        <h3 className='text-3xl'>Course Sales : </h3>
        <div className='space-y-4 mt-5'>
        {courseBought && courseBought.length < 1  && (
            "No data available"
        )}
        {courseBought && courseBought.map((course:courseBought)=>{
          return  <CourseBoughtCard key={course.id} courseDetails={course} /> 
        })}

        </div>
        {/**/}
    </section>
      </div>
  )
}

export default CourseAnalytics
