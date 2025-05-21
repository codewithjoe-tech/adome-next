"use client"
import { store } from "@/Redux/store";
// import { useAuth } from "@/context";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { getCookie,removeCookie, setCookie } from "typescript-cookie";



const apiUrl = process.env.NEXT_PUBLIC_API_URL 
const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout : 15000,
});

// const {userLoggedIn} = useAuth()
let isRefreshing = false;

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const currentTime:Number = Math.floor(Date.now() / 1000);
      const schemaName = store.getState().app.schemaName
      const tokenExpiry:Number = Number(getCookie(`${schemaName}_expiry`));

      if ( tokenExpiry && currentTime > tokenExpiry) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
         
            const response:any = await axios.post(`${apiUrl}user/${schemaName}/refresh`, {}, { withCredentials: true });
            const data= response.data
            // const refresh_token:string = data.refresh
            // const access_token:string = data.access
            const expiry = data.expiry
            // setCookie(`${schemaName}_refresh_token`, refresh_token)
            // setCookie(`${schemaName}_access_token`, access_token)
            // setCookie(`${schemaName}_expiry`, expiry)
            // console.log(data)
            setCookie(`${schemaName}_expiry`, expiry, {
                      expires : 1
                    })
            console.log(response)
          } catch (error) {
            console.error("Token refresh failed. Logging out user.");
            throw new Error("Logout")

           
          } finally {
            isRefreshing = false;
          }
        } else {
          console.log("Token refresh already in progress, waiting...");
        }
      }

      return config;
    } catch (error) {
      const schemaName = store.getState().app.schemaName
      // const response:any = await axios.post(`${apiUrl}user/${schemaName}/logout`, {}, { withCredentials: true });
      //       const data= response.data
  //  removeCookie('refresh_token')
  //  removeCookie('access_token')
   removeCookie(`${schemaName}_expiry`)
      console.error("Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      error.message = "Too many attempts. Please try again later.";
      toast.error('IP Blocking for 1 minutes !!! ',{
        description : "Too many attempts. Please try again later."
      })
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;