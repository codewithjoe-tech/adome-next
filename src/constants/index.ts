
import axiosInstance from "@/axios/public-instance";
import { LANDING_PAGE_MENU, MenuProps } from "./menus";

type AdomeConstantsProbs = {
    landingPageMenu: MenuProps[]
    
  }

export const ADOME_CONSTANTS: AdomeConstantsProbs = {
    landingPageMenu : LANDING_PAGE_MENU,
}




export const prices = [
  {
    price : 0,
    features : [
      "Unlimited users",
      "Website builder",
      "Unlimited Blogs",
      "Subdomain",
      "24/7 support"
    ],
    plan_type : "1"
  },
  {
    price : 5000,
    features : [
      "Everything in free",
      "AI Website builder",
      "Unlimited Courses",
      "Custom Domain",
      "24/7 Premium support"
    ],
    plan_type : "2"
  }
]

export const getSubdomain = (): string => {
  if (typeof window !== "undefined") {
      const hostname = window.location.hostname; 
      const parts = hostname.split(".");

      const localhostIndex = parts.indexOf("localhost");
      if (localhostIndex > 0) {
          return parts.slice(0, localhostIndex).join("."); 
      }
  }
  return "public"; 
};



export const getTwoLetters = (full_name:string|undefined) => {
  if (!full_name) return; 
  const splittedName = full_name.split(" ");
  if (splittedName.length > 1) {
    return splittedName[0][0] + splittedName[1][0];
  } else {
    return full_name[0];
  }
};
export const getLetters = (words: string): string => {
  if (!words.trim()) return ''; 
  

  return words
    .split(' ') 
    .map(word => word.charAt(0)) 
    .join('')
    .toUpperCase();
};



export type EditorBtns =
  | 'text'
  | 'container'
  | 'section'
  | 'contactForm'
  | 'paymentForm'
  | 'link'
  | '2Col'
  | 'video'
  | '__body'
  | 'image'
  | null
  | '3Col'
  | 'navbar'


  export const defaultStyles: React.CSSProperties = {
    backgroundPosition: 'center',
    objectFit: 'cover',
    backgroundRepeat: 'no-repeat',
    textAlign: 'left',
    opacity: '100%',
  }
  export const blogs = [
    {
      id: 1,
      title: "The Future of AI in Web Development",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
      description: "Exploring how AI is shaping the future of web applications.",
      author: "John Doe",
    },
    {
      id: 2,
      title: "Mastering React with TypeScript",
      image: "https://images.unsplash.com/photo-1522252234503-e356532cafd5",
      description: "A guide to building scalable applications with React and TypeScript.",
      author: "Jane Smith",
    },
    {
      id: 3,
      title: "Why Tailwind CSS is a Game Changer",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      description: "How Tailwind CSS improves the speed and efficiency of styling in modern projects.",
      author: "Emily Johnson",
    },
    {
      id: 4,
      title: "Understanding Serverless Architecture",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      description: "An in-depth look at serverless computing and its benefits.",
      author: "Michael Brown",
    },
    {
      id: 5,
      title: "Building Scalable SaaS with Next.js",
      image: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368",
      description: "How Next.js helps in building high-performance SaaS platforms.",
      author: "Sarah Wilson",
    },
  ];
  

  export const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  