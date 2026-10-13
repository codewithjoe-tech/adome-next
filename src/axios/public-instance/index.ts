"use client";
import { store } from "@/Redux/store";
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import { getCookie, setCookie, removeCookie } from "typescript-cookie";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// In local dev, call the API through the page's own hostname (codewithjoe.localhost
// -> http://codewithjoe.localhost/) so auth cookies stay same-site. Browsers treat
// localhost vs sub.localhost as cross-site and block/partition cookies otherwise.
const getApiUrl = (): string | undefined => {
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h.endsWith(".localhost")) {
      return `http://${h}/`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL;
};

const apiUrl = getApiUrl();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    const schemaName = store.getState().app.schemaName;
    const tokenExpiry = Number(getCookie(`${schemaName}_expiry`));
    const currentTime = Math.floor(Date.now() / 1000);

    if (config.url?.includes("/refresh")) {
      return config;
    }

    if (config._retry) {
      return config;
    }

    if (tokenExpiry && currentTime > tokenExpiry) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .post(`${apiUrl}/user/${schemaName}/refresh`, {}, { withCredentials: true })
          .then((response) => {
            const { expiry } = response.data;
            setCookie(`${schemaName}_expiry`, expiry);
          })
          .catch((err) => {
            toast.warning("Logging out", {
              description: "User is logged out successfully",
            });
            removeCookie(`${schemaName}_expiry`);
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

     
      await refreshPromise;
      config._retry = true;
      return axiosInstance(config); 
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 429) {
      error.message = "Too many attempts. Please try again later.";
      toast.error("Too many attempts!!!", {
        description: "You cannot request for 1 minute as you are banned for a minute",
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;