"use client"

import { Button } from "@/components/ui/button"
// import { useGoogleAuth } from "@/hooks/authentication"
import { Google } from "@/components/forms/TenantForm/icons"
import { RootState } from "@/Redux/store"
import { useSelector } from "react-redux"
import { getSubdomain } from "@/constants"
// import { Loader } from "../loader"

type GoogleAuthButtonProps = {
//   method: "signup" | "signin"
}

export const GoogleAuthButton = () => {
    const {schemaName} = useSelector((state:RootState) =>state.app)
    const googleSignup = ()=>{
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL }user/${schemaName}/login`
        return 
    }
//   const { signUpWith, signInWith } = useGoogleAuth()
  return (
    <Button
     
      className=" rounded-2xl  gap-3 bg-themeBlack border-themeGray"
      variant="outline"
        onClick={googleSignup}
    >
      {/* <Loader loading={false}> */}
        <Google />
        Login with  Google 
      {/* </Loader> */}
    </Button>
  )
}