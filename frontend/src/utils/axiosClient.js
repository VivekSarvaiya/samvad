import axios from "axios";
import { ACCESS_TOKEN, USER_DATA, getLocalStorageItem, removeLocalStorageItem } from "./localStroageManager";
import { BASE_API_URL } from "../constants";

const axiosClient = axios.create({
   // baseURL: import.meta.env.VITE_APP_BASE_API_URL,
   baseURL: BASE_API_URL,
   withCredentials: true,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
   (request) => {
      const accessToken = getLocalStorageItem(ACCESS_TOKEN);
      request.headers['Authorization'] = `Bearer ${accessToken}`;
      return request;
   }
)

// Add a response interceptor
axiosClient.interceptors.response.use(
   (response) => response,
   async (error) => {
      if (error.response.status === 401) {
         removeLocalStorageItem(ACCESS_TOKEN, USER_DATA);
         window.location.replace("/login", "_self");
      }

      return Promise.reject(error);
   }
);

export default axiosClient;