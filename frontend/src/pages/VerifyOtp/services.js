import axiosClient from "../../utils/axiosClient";
import { errorResponse, successResponse } from "../../utils/responseWrapper";


export const onVerifyOtp = async (body) => {
   try {
      const verify_otp_api_url = `/users/verifyOtp`;
      const result = await axiosClient.post(verify_otp_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while otp verification', error);
      return errorResponse(error?.response?.data?.message || "error occurred while otp verification");
   }
}