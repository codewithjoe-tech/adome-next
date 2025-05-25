"use client"

import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Edit, LucideBell, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import axiosInstance from '@/axios/public-instance'
import { useMutation } from '@tanstack/react-query'
import {  getTwoLetters } from '@/constants'
import { removeCookie } from 'typescript-cookie'
import { useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { usePathname } from 'next/navigation'
import BlogDialog from './_components/blog-dialog'
import WebDialog from './_components/webbuilder-dialog'
import CourseDialog from './_components/course-dialog'
import { ModeToggle } from '@/components/theme-toggle'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import ModuleDialog from './_components/course-module-dialog'

type Props = {
  className?: string
}

const useModuleIdPath = () => {
  const pathname = usePathname()
  // console.log(pathname)
  const courseId = React.useMemo(() => {
    const parts = pathname.split('/')
    const index = parts.findIndex(p => p === 'chapters')
    return parts[index - 1] || null
  }, [pathname])
  return courseId
}
const InfoBar = ({ className }: Props) => {
  const user = useSelector((state: RootState) => state.user.user)  
  const [fallBackName, setFallBackName] = useState<string>('U')
  const {schemaName} = useSelector((state:RootState)=>state.app)
  const pathName = usePathname()
  const moduleId = useModuleIdPath()
  // console.log(moduleId)
  // Logout function
  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => await axiosInstance.post(`user/${schemaName}/logout`),
    onSuccess: () => {
      removeCookie(`${schemaName}_expiry`)
      removeCookie('refresh_token')
      removeCookie('access_token')
      window.location.href = '/login'
    },
    // onSettled: () => // console.log('Logout completed'),
    onError: () => console.error('Logout failed'),
  })

  useEffect(() => {
    if (user?.user.full_name) {
      setFallBackName(getTwoLetters(user?.user.full_name) || 'U')  
    }
  }, [user])

  return (
    <div
      className={twMerge(
        'fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-themeBlack backdrop-blur-md flex gap-4 items-center border-b-[1px]',
        className
      )}
    >
      <div className="flex items-center gap-2 ml-auto">
      { pathName.endsWith('/admin/blog') && <BlogDialog/>}
      { pathName.endsWith('/admin/builder') && <WebDialog/>}
      { pathName.endsWith('/admin/courses') && <Link href={'/admin/courses/create'}><Button>Create course</Button></Link>}
      { pathName.endsWith('/modules') && <ModuleDialog />}
      { pathName.endsWith('/chapters') && <Link href={`/admin/modules/${moduleId}/chapters/create`}><Button>Create Chapter</Button></Link>}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.user?.profile_pic || '/default-avatar.png'} alt="Profile" />
              <AvatarFallback>{fallBackName}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-themeBlack'>
            <DropdownMenuLabel>
            {user.is_admin? "Admin : " : user.designation}
              {user.user.full_name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator  className="my-1 h-px bg-gray-600" />
            <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="cursor-pointer bg-themeBlack hover:bg-themeTextGray">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      
      </div>
    </div>
  )
}

export default InfoBar
