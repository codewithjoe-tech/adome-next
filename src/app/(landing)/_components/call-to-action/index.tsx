
"use client"
import GradientText from "@/components/global/gradiant-text"
import { Button } from "@/components/ui/button"
import { BadgePlus } from "@/components/forms/TenantForm/icons"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/Redux/store"

type Props = {}

const CallToAction = (props: Props) => {
  const {schemaName} = useSelector((state:RootState)=>state.app)
  return (
    <div className="flex flex-col items-start md:items-center gap-y-5 md:gap-y-0">
      <GradientText
        className="text-[35px] md:text-[40px] lg:text-[55px] xl:text-[70px] 2xl:text-[80px] leading-tight font-semibold"
        element="H1"
      >
        Reinvent Education  <br className="md:hidden" />  Today
      </GradientText>
      <p className="text-sm md:text-center text-left text-muted-foreground">
  Adome is a dynamic learning platform that empowers  
  <br className="md:hidden" />  
  individuals to connect,  
  <br className="hidden md:block" />  
  collaborate, and cultivate meaningful  
  <br className="md:hidden" />  
  knowledge while shaping the future of education.  
</p>

      <div className="flex md:flex-row flex-col md:justify-center gap-5 md:mt-5 w-full">
        <Button
          variant="outline"
          className="rounded-xl bg-transparent text-base"
        >
          Watch Demo
        </Button>
        <Link href={`${process.env.NEXT_PUBLIC_API_URL }user/${schemaName}/login`} passHref>
          <Button className="rounded-xl text-base flex gap-2 w-full">
            <BadgePlus /> Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default CallToAction