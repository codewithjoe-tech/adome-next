"use client"

import axiosInstance from '@/axios/public-instance'
import CourseCards from '@/components/Course/course-card'
import GradientText from '@/components/global/gradiant-text'
import withSubscriptionCheck from '@/HOC/subscription-check'
import { RootState } from '@/Redux/store'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const page = (props: Props) => {
  const {schemaName} = useSelector((state:RootState)=>state.app)

  const {data , isLoading , isError} = useQuery({
    queryKey : ['getMyCourses' ,],
    queryFn : async ()=>{
        const res = await axiosInstance.get(`course/${schemaName}/my-courses`);
        console.log(res.data)
        return res.data
    }
  })
  return (
    <div className="min-h-screen bg-themeBlack">
      {/* Banner Section with Background Image */}
      <div
        className="w-full h-64 bg-cover bg-center relative flex items-center justify-center img--overlay"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?cs=srgb&dl=pexels-pixabay-147411.jpg&fm=jpg')`,
          backgroundAttachment: 'fixed',
        }}
      >
        {/* <h1 className="relative text-4xl md:text-5xl font-bold text-themeTextWhite text-center z-10">
          My Courses
        </h1> */}
        <GradientText element='H1' className="relative text-4xl md:text-5xl font-bold text-themeTextWhite text-center z-10">My Courses</GradientText>
      </div>

      {/* Course Cards Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for course cards */}
          {/* id,
  title,
  thumbnail,
  content,
  onDelete,
  is_admin = false,
  sm,
  price,
  onClick ,
  owned= false */}
          {
            data && data.map((courses: any) => (
              <CourseCards key={courses.course.id} id={courses.course.id} thumbnail={courses.course.thumbnail} title={courses.course.title} onClick={()=>{}} content={courses.course.content} price={courses.course.price} owned={courses.course.owned} />
            ))
          }
        {/* <CourseCards /> */}
          {/* Add more course cards as needed */}
        </div>
      </div>
    </div>
  )
}

export default withSubscriptionCheck(React.memo(page));