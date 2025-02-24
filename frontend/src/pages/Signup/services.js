import axiosClient from "../../utils/axiosClient";
import { errorResponse, successResponse } from "../../utils/responseWrapper";


export const onSendOtp = async (body) => {
   try {
      const send_otp_api_url = `/users/sendOtp`;
      const result = await axiosClient.post(send_otp_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while sending otp', error);
      return errorResponse(error?.response?.data?.message || "error occurred while sending otp");
   }
}