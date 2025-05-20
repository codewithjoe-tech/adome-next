"use client"
import { store } from "@/Redux/store";
// import { useAuth } from "@/context";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
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
      const tokenExpiry:Number = Number(getCookie("expiry"));
      const currentTime:Number = Math.floor(Date.now() / 1000);
      const schemaName = store.getState().app.schemaName

      if ( tokenExpiry && currentTime > tokenExpiry) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
         
            const response:any = await axios.post(`${apiUrl}user/${schemaName}/refresh`, {}, { withCredentials: true });
            const data= response.data
            const refresh_token:string = data.refresh
            const access_token:string = data.access
            const expiry = data.expiry
            setCookie('refresh_token', refresh_token)
            setCookie('access_token', access_token)
            setCookie('expiry', expiry)
            console.log(data)
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
   removeCookie('refresh_token')
   removeCookie('access_token')
   removeCookie('expiry')
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
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;