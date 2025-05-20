'use client'

import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { Button } from '@/components/ui/button'
import { Menu as MenuIcon, Router } from 'lucide-react'
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
import GlassSheet from '@/components/global/glass-sheet'
import axiosInstance from '@/axios/public-instance'
import { getCookie, removeCookie } from 'typescript-cookie'
import { logout } from '@/Redux/slices/user-details'
import { usePathname, useRouter } from 'next/navigation'

const Navbar = () => {
  const pathName = usePathname()
  const router = useRouter()

  const dispatch = useDispatch()
  const { tenant, schemaName } = useSelector((state: RootState) => state.app)
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const isAdmin = user?.is_admin || user?.is_staff
  if (pathName === '/' || pathName.startsWith('/admin') || pathName.startsWith("/login")) return

  const handleLogout = async () => {
    const response = await axiosInstance.post(`user/${schemaName}/logout`)
    if (response.status === 200) {
      removeCookie('refresh_token')
      removeCookie('access_token')
      removeCookie('expiry')
      dispatch(logout())
    }
  }

  const expiry = getCookie('expiry')

  const navItems = [
    { label: 'Home', href: '/' },
    ...(expiry && isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
    { label: 'Blog', href: '/blog' },
    ...((expiry && tenant.subscription_plan === '2') ? [{ label: 'Communities', href: '/community' }] : []),
    ...((tenant.subscription_plan === '2') ? [{ label: 'Course', href: '/courses' }] : []),
  ]

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-border z-[999] bg-black sticky top-0">
      <p className="text-2xl font-bold">{tenant.name}.</p>

      <div className="hidden lg:flex gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 rounded-lg  transition"
          >
            {item.label}
          </Link>
        ))}
      </div>

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
              {tenant.subscription_plan === '2' && <DropdownMenuItem
                onClick={() => {
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
        ) : (
          <Link href="/login" passHref>
            <Button variant="outline" className="rounded-2xl">
              Login
            </Button>
          </Link>
        )}

        <GlassSheet
          triggerClass="lg:hidden"
          trigger={
            <Button variant="ghost" className="hover:bg-transparent">
              <MenuIcon size={30} />
            </Button>
          }
        >
          <div className="flex flex-col mt-10 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg hover:bg-muted transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </GlassSheet>
      </div>
    </nav>
  )
}

export default Navbar
