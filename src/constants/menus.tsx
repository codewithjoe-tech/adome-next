import { CreditCard, Explore, Home } from "@/components/forms/TenantForm/icons";
import { JSX } from "react";


export type MenuProps = {
    id: number
    label: string
    icon: JSX.Element
    path: string
    section?: boolean
    integration?: boolean
  }

export const LANDING_PAGE_MENU: MenuProps[] = [
    {
      id: 0,
      label: "Home",
      icon: <Home />,
      path: "/",
      section: true,
    },
    {
      id: 1,
      label: "Pricing",
      icon: <CreditCard />,
      path: "#pricing",
      section: true,
    },
 
  ]