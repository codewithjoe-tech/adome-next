import { JSX } from "react"

export interface TenantFormType {
    name: string;
    logo: string;         
    subdomain: string;
    contact_email: string;
    location: string;
    description: string; 
    blog: boolean;        
    community: boolean;   
    newsletter: boolean;  
    courses: boolean;     
}

export type SidebarType = {
     id: string;
     name: string;
     link: string; 
     icon: JSX.Element
     permission? : "hasStaffPermission" | "hasSettingPermission" | "hasBuilderPermission" | "hasBlogPermission" | "hasCommunityPermission" | "hasNewsletterPermission" | "hasCoursesPermission" | "hasPaymentPermission" ;
 }
//  hasStaffPermission: false,
//  hasBlogPermission: false,
//  hasCommunityPermission: false,
//  hasNewsletterPermission: false,
//  hasCoursesPermission: false,
//  hasBuilderPermission : false
export type tenantType = {
    id: number | null;
    name: string;
    domain: string | null;
    contact_email: string;
    location: string;
    description: string | null;
    blog: boolean | null;
    community: boolean | null;
    newsletter: boolean | null;
    admin?: number | null;
    subscription_plan: string | null;
    subdomain: string | null;
    logo: string; 
    courses: boolean;
};



export type UserDetails ={
    email : string
    full_name : string
    username : string
    profile_pic : string
}


export type UsersType = {
    user : UserDetails
    role : string
    tenant: number
    blocked : boolean
    banned : boolean
    created_at : string
    designation : string
    id : number
    is_staff : boolean
    is_admin : boolean
    hasStaffPermission: boolean
    hasBlogPermission: boolean
    hasCommunityPermission: boolean
    hasNewsletterPermission: boolean
    hasCoursesPermission: boolean
    hasBuilderPermission : boolean

    
}


export type staffPermission = {
    hasStaffPermission: boolean
    hasBlogPermission: boolean
    hasCommunityPermission: boolean
    hasNewsletterPermission: boolean
    hasCoursesPermission: boolean
    hasBuilderPermission : boolean
    designation: string
    is_staff: boolean
}

export type Role = "user" | "admin" | "staff";


// Define the structure of the state
export interface ColorState {
    color: string;
    opacity: number;
    gradient: boolean;
    direction: string;
    color1: string;
    color2: string;
    image?: string;
    opacity1: number;
    opacity2: number;
    selectedColor: number;
    ImageSize? : string
  }
  
  // Define the possible action types
  export type ColorAction =
    | { type: "SET_COLOR"; payload: string }
    | { type: "SET_GRADIENT"; payload: boolean }
    | { type: "SET_DIRECTION"; payload: string }
    | { type: "SET_OPACITY"; payload: number }
    | { type: "SET_IMAGE"; payload: string }
    | { type: "SET_COLOR1"; payload: string }
    | { type: "SET_COLOR2"; payload: string }
    | { type: "SET_OPACITY1"; payload: number }
    | { type: "SET_OPACITY2"; payload: number }
    | {type : "SET_SELECTED_COLOR"; payload: number }
    | { type: "SET_IMAGE_SIZE"; payload: string } 
    | { type: "RESET" ; payload : ColorState }; 



export type useAzureType = {
        open: boolean;
        title: string;
        description: string;
        setDescription: (desc: string) => void;
        setTitle: (title: string) => void;
        handleOpen: () => void;
        setOnConfirm: (fn: () => void) => void;
        onConfirm: () => void;
};
      

export type courseBought = {
    id : string 
    course : string
    user : string
    profile_pic : string
    created_at : string
}