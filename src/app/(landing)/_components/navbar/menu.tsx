"use client"

import { Card, CardContent } from '@/components/ui/card'
import { ADOME_CONSTANTS } from '@/constants'
import { useNavigation } from '@/hooks/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  orientation : "mobile" | "desktop"
}

const Menu = ({orientation}: Props) => {
  const {section , onSetSection} = useNavigation()
 switch (orientation) {
  case "desktop":
    
    return (
    <Card className='bg-themeGray border-themeGray  bg-clip-padding backdrop-blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex hidden rounded-xl'>
      <CardContent className='p-0 flex gap-2'>
      {ADOME_CONSTANTS.landingPageMenu.map((menuItem) => (
             <Link
             href={menuItem.path}
             {...(menuItem.section && {
               onClick: () => onSetSection(menuItem.path),
             })}
             className={cn(
               "rounded-xl flex gap-2 py-2 px-4 items-center",
               section === menuItem.path ? "bg-[#09090B] border-[#27272A]" : ""
             )}
             key={menuItem.id}
           >
             <div className="flex items-center gap-2">
               {section === menuItem.path && menuItem.icon}
               <span>{menuItem.label}</span>
             </div>
           </Link>
            ))}
      </CardContent>
    </Card>
    )
  case "mobile" :
    return  <div className="flex flex-col mt-10">
    {ADOME_CONSTANTS.landingPageMenu.map((menuItem) => (
         <Link
         href={menuItem.path}
         {...(menuItem.section && {
           onClick: () => onSetSection(menuItem.path),
         })}
         className={cn(
           "rounded-xl flex gap-2 py-2 px-4 items-center",
           section === menuItem.path ? "bg-[#09090B] border-[#27272A]" : ""
         )}
         key={menuItem.id}
       >
         <div className="flex items-center gap-2">
           {section === menuItem.path && menuItem.icon}
           <span>{menuItem.label}</span>
         </div>
       </Link>
    ))}
  </div>
 
  default:
    return <></>
 }
}

export default Menu