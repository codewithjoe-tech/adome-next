"use client";
import { store } from "@/Redux/store";
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie, setCookie, removeCookie } from "typescript-cookie";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (config: InternalAxiosRequestConfig) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      // Resolve with the original config to retry the request
      prom.resolve(prom.config);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const schemaName = store.getState().app.schemaName;
    const tokenExpiry = Number(getCookie(`${schemaName}_expiry`));
    const currentTime = Math.floor(Date.now() / 1000);

    if (config.url?.includes("/refresh")) {
      return config; // Avoid infinite loop
    }

    if (tokenExpiry && currentTime > tokenExpiry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post(
            `${apiUrl}user/${schemaName}/refresh`,
            {},
            { withCredentials: true }
          );
          const { expiry } = response.data;
          setCookie(`${schemaName}_expiry`, expiry);

          // Process queued requests
          processQueue(null);
        } catch (err) {
          processQueue(err);
          removeCookie(`${schemaName}_expiry`);
          throw err;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          config,
          resolve: (updatedConfig: InternalAxiosRequestConfig) => {
            // Retry the original request with the original config
            resolve(axiosInstance(updatedConfig));
          },
          reject,
        });
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      error.message = "Too many attempts. Please try again later.";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;