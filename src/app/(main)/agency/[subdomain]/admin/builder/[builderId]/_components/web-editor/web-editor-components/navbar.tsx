'use client'

import { Badge } from '@/components/ui/badge'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash, Menu as MenuIcon } from 'lucide-react'
import React, { use } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import GlassSheet from '@/components/global/glass-sheet'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import axiosInstance from '@/axios/public-instance'
import { getCookie, removeCookie } from 'typescript-cookie'
import { logout } from '@/Redux/slices/user-details'
import { useRouter } from 'next/navigation'

type Props = {
  element: EditorElement
}

const Navbar = ({ element }: Props) => {
  const { dispatch, state } = useEditor()
  const router = useRouter()
  const styles = element.styles

  const { tenant, schemaName } = useSelector((state: RootState) => state.app)
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const reduxDispatch = useDispatch()

  const liveMode = state.editor.liveMode
  const isAdmin = user?.is_admin || user?.is_staff

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: { elementDetails: element },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: element },
    })
  }

  const expiry = getCookie(`${schemaName}_expiry`)
  const handleLogout = async () => {
    const response = await axiosInstance.post(`user/${schemaName}/logout`)
    if (response.status == 200) {
      removeCookie('refresh_token')
      removeCookie('access_token')
      removeCookie(`${schemaName}_expiry`)
      reduxDispatch(logout())
    }
  }

  const navItems = [
    { label: 'Home', href: '/' },
    ...(expiry && isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
    { label: 'Blog', href: '/blog' },
    // { label: 'Courses', href: '/courses' },
    ...(( expiry && tenant.subscription_plan==='2')? [{ label: 'Communities', href: '/community' }] : []),
    ...((  tenant.subscription_plan==='2')? [{ label: 'Course', href: '/courses' }] : []),
  ]

  const renderNavItem = (item: { label: string; href: string }) =>
    liveMode ? (
      <Link
        key={item.href}
        href={item.href}
        className="px-4 py-2 rounded-lg"
        style={styles}
      >
        {item.label}
      </Link>
    ) : (
      <span
        key={item.href}
        className="px-4 py-2 rounded-lg cursor-default"
        style={styles}
      >
        {item.label}
      </span>
    )

  return (
    <nav
      style={styles}
      onClick={handleOnClick}
      className={clsx(
        'p-4 w-full flex justify-between items-center relative',
        {
          '!border-blue-500 border-solid':
            state.editor.selectedElement.id === element.id,
          'border-dashed border-[1px] border-slate-300': !liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === element.id && !liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
          {state.editor.selectedElement.name}
        </Badge>
      )}

      <p className="text-2xl font-bold">{tenant.name}.</p>

      <div className="hidden lg:flex gap-4">{navItems.map(renderNavItem)}</div>

      {/* Right section */}
      <div className="flex items-center gap-2">
      {expiry ? (
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.user.profile_pic} alt={user.user.full_name} />
                <AvatarFallback>{user.user.full_name?.[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-themeBlack relative z-[1000]" align="end">
              <DropdownMenuLabel className="truncate max-w-full">
                {user.user.full_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
             {tenant.subscription_plan  === '2' && <DropdownMenuItem
                onClick={()=>{
                  router.push('/my-courses')
                }}
                className="font-medium cursor-pointer"
              >
                My Courses
              </DropdownMenuItem>}
              <DropdownMenuItem
                onClick={handleLogout}
                className="font-medium cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )  : (
          <Link href="/login" passHref>
            <Button
              variant="outline"
              className="rounded-2xl flex gap-2"
              style={styles}
            >
              Login
            </Button>
          </Link>
        )}

        {/* Mobile Nav */}
        <GlassSheet
          triggerClass="lg:hidden"
          trigger={
            <Button variant={'ghost'} className="hover:bg-transparent">
              <MenuIcon size={30} />
            </Button>
          }
        >
          <div className="flex flex-col mt-10">{navItems.map(renderNavItem)}</div>
        </GlassSheet>
      </div>

      {state.editor.selectedElement.id === element.id && !liveMode && (
        <div className="absolute bg-blue-500 px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={handleDeleteElement}
          />
        </div>
      )}
    </nav>
  )
}

export default Navbar
