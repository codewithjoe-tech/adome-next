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
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const schemaName = store.getState().app.schemaName;
    const tokenExpiry = Number(getCookie(`${schemaName}_expiry`));
    const currentTime = Math.floor(Date.now() / 1000);

    if (tokenExpiry && currentTime > tokenExpiry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axios.post(
            `${apiUrl}user/${schemaName}/refresh`,
            {},
            { withCredentials: true }
          );
          const { refresh, access, expiry } = response.data;
          setCookie(`${schemaName}_refresh_token`, refresh);
          setCookie(`${schemaName}_access_token`, access);
          setCookie(`${schemaName}_expiry`, expiry);

          processQueue(null, access); // Retry queued requests
        } catch (err) {
          processQueue(err, null);
          // removeCookie(`${schemaName}_refresh_token`);
          // removeCookie(`${schemaName}_access_token`);
          removeCookie(`${schemaName}_expiry`);
          throw err;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(config),
          reject: (err) => reject(err),
        });
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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
