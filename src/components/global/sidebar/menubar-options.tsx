"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarType } from "@/types"
import clsx from "clsx"
import { CommandItem } from "cmdk"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { JSX, useEffect, useMemo, useState } from "react"

type Props = {
    defaultOpen: boolean
    sidebarLogo: string
    sidebarOpt: SidebarType[]
}
const MenuOptions = ({ defaultOpen, sidebarLogo, sidebarOpt }: Props) => {

    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)

    }, [])

    const openState = useMemo(() => (defaultOpen ? { open: true } : {}), [defaultOpen])
    if (!isMounted) return

    return (
        <Sheet  modal={false}  {...openState}>
            <SheetTrigger asChild className="absolute left-4 top-4 z-[100] md:!hidden flex">
                <Button variant={'outline'} size={'icon'}>
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent
            showX={false}
                side={'left'}
                className={clsx(
                    'bg-themeBlack backdrop-blur-xl fixed top-0 border-r-[1px] p-6 ring-0',
                    {
                        'hidden md:inline-block z-0 w-[300px]': defaultOpen,
                        'inline-block md:hidden z-[100] w-full': !defaultOpen,
                    }
                )}
                >
                    {/* <VisuallyHidden></VisuallyHidden> */}
                <SheetTitle className="hidden">MenuItems</SheetTitle>
                <div>
                <AspectRatio ratio={10 / 5}>
           {
            sidebarLogo && (
                <Image
                src={sidebarLogo}
                alt="Sidebar Logo"
                fill
                className="rounded-md object-contain"
              />
            )
           }
          </AspectRatio>
          {/* <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p> */}
          {/* <Separator className="my-4" /> */}
          <nav className="relative">
          <Command className="rounded-lg overflow-visible bg-transparent">
          <CommandInput placeholder="Search..." />
          <CommandList className="py-4 overflow-visible">
          <CommandEmpty>No Results Found</CommandEmpty>
          <CommandGroup className="overflow-visible"> 
            {
                sidebarOpt.map((sidebarOptions)=>{
                    let val 
                  
                    
                    return (
                        <CommandItem
                        key = {sidebarOptions.id}
                         className="md:w-[320px] my-2 w-full"
                        >
                            <Link
                          href={sidebarOptions.link}
                          className="flex items-center gap-2 hover:hover:bg-themeGray p-2 rounded-md transition-all md:w-full w-[320px]"
                        >
                          <span className="text-themeDarkGray">
                            {sidebarOptions.icon}
                          </span>
                          <span>{sidebarOptions.name}</span>
                        </Link>


                        </CommandItem>
                    )
                })
            }
          </CommandGroup>
          </CommandList>
          </Command>

          </nav>
                </div>




            </SheetContent>

        </Sheet>
    )
}

export default MenuOptions
