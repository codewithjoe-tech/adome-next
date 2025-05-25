"use client"

import React from "react"
import { BookA, BookDashed, BookOpen, CreditCard, Globe, SubscriptIcon, User } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/Redux/store"
import { SidebarType } from "@/types"
import MenuOptions from "./menubar-options"
import { GlobeDuoToneBlack, HomeDuoToneWhite, Settings } from "@/components/forms/TenantForm/icons"

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const tenant = useSelector((state: RootState) => state.app.tenant)
  const menuItems: SidebarType[] = [
    { id: "1", name: "Dashboard", link: "/admin/", icon: <HomeDuoToneWhite /> },
    { id: "2", name: "Users", link: "/admin/users", icon: <User className="text-themeTextGray" />, permission: "hasStaffPermission" },
...(tenant.courses ? [{
      id: "3",
      name: "Courses",
      link: "/admin/courses",
      icon: <BookA className="text-themeTextGray" size={20} />,
      permission: "hasCoursesPermission" as const,
    }] : []),

    ...(tenant.blog ? [{
      id: "4",
      name: "Blog",
      link: "/admin/blog",
      icon: <BookOpen className="text-themeTextGray" size={20} />,
      permission: "hasBlogPermission" as const,
    }] : []),
    { id: "9", name: "Plan Change", link: "/admin/subscription", icon: <SubscriptIcon className="text-themeTextGray" size={20} />, permission: "hasSettingPermission" },
    { id: "5", name: "Website Builder", link: "/admin/builder", icon: <GlobeDuoToneBlack />, permission: "hasBuilderPermission" },
    { id: "8", name: "Custom Domain", link: "/admin/custom-domain", icon: <Globe  className="text-themeTextGray" />, permission: "hasSettingPermission" },
    { id: "6", name: "Payment Gateway", link: "/admin/payment", icon: <CreditCard className="text-themeTextGray" size={20} />, permission: "hasPaymentPermission" },
    { id: "7", name: "Settings", link: "/admin/settings", icon: <Settings />, permission: "hasSettingPermission" },
  ]
  



const menuFilter = (menuItems: SidebarType[]) => {
  if (!user) return [];

  return menuItems.filter((item) => {
    if (tenant.subscription_plan === '1' && (item.id === '3' || item.id === '8' || item.id=='6')) {
      return false;
    }
    if (user.is_admin) return true;
    if (!item.permission) return true;
    
    return user[item.permission as keyof typeof user] ?? false;
  });
};

  return (
    <MenuOptions
      defaultOpen={true}
      sidebarLogo={tenant?.logo || "/default-logo.png"}
      sidebarOpt={menuFilter(menuItems)}
    />
  )
}

export default Sidebar
