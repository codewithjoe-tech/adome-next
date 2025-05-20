"use client"

import React from 'react';
import Menu from './menu';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logout } from '@/components/forms/TenantForm/icons';
import GlassSheet from '@/components/global/glass-sheet';
import { MenuIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { env } from 'process';

type Props = {};

const LandingPageNavbar = (props: Props) => {
  const { isLoggedIn} = useSelector((state:RootState) =>state.user)
  const { schemaName} = useSelector((state: RootState) => state.app)
  return (
    <div className="w-full  flex justify-between  sticky top-0 items-center py-5 z-50">
      <p className="font-bold text-2xl ">Adome.</p>
      <Menu orientation="desktop"  />


{

      ( <Link href={`${process.env.NEXT_PUBLIC_API_URL }user/${schemaName}/login`} passHref>
        <Button
          variant={'outline'}
          className="bg-themeBlack rounded-2xl flex  gap-2 border-themeGray hover:bg-themeGray"
        >
          <Logout />
          Login
        </Button>
      </Link>)

}
      <GlassSheet
        triggerClass="lg:hidden"
        trigger={
          <Button variant={'ghost'} className="hover:bg-transparent">
            <MenuIcon size={30} />
          </Button>
        }
      >
        <Menu orientation="mobile" />
      </GlassSheet>
    </div>
  );
};

export default LandingPageNavbar;
