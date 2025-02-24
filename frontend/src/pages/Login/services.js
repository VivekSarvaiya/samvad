import axiosClient from "../../utils/axiosClient";
import { errorResponse, successResponse } from "../../utils/responseWrapper";


export const onLogin = async (body) => {
   try {
      const login_api_url = `/users/login`;
      const result = await axiosClient.post(login_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while logging in', error);
      return errorResponse(error?.response?.data?.message || "error occurred while logging in");
   }
}