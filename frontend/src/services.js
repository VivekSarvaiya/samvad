import axiosClient from "./utils/axiosClient";
import { errorResponse, successResponse } from "./utils/responseWrapper";


export const onGetMyProfile = async () => {
   try {
      const get_my_profile_api_url = `/users/getMyProfile`;
      const result = await axiosClient.get(get_my_profile_api_url);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while fetching profile details', error);
      return errorResponse(error?.response?.data?.message || "error occurred while fetching profile details");
   }
}

export const onSearchUsers = async (username = "") => {
   try {
      const search_users_api_url = `/users/getUsersByUsername?username=${username}`;
      const result = await axiosClient.get(search_users_api_url);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while searching users by username', error);
      return errorResponse(error?.response?.data?.message || "error occurred while searching users by username");
   }
}

export const onSendRequest = async (body) => {
   try {
      const send_request_api_url = `/requests`;
      const result = await axiosClient.post(send_request_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while sending request', error);
      return errorResponse(error?.response?.data?.message || "error occurred while sending request");
   }
}

export const onGetRequests = async () => {
   try {
      const get_requests_api_url = `/requests`;
      const result = await axiosClient.get(get_requests_api_url);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while fetching requests', error);
      return errorResponse(error?.response?.data?.message || "error occurred while fetching requests");
   }
}

export const onDeleteRequests = async (requestId) => {
   try {
      const delete_requests_api_url = `/requests/${requestId}`;
      const result = await axiosClient.delete(delete_requests_api_url);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while deleteing requests', error);
      return errorResponse(error?.response?.data?.message || "error occurred while deleteing requests");
   }
}

export const onAcceptRequests = async (requestId) => {
   try {
      const accept_requests_api_url = `/requests/${requestId}`;
      const result = await axiosClient.post(accept_requests_api_url);
      return successResponse(result.data);
   } catch (error) {
      console.log('error occurred while accepting requests', error);
      return errorResponse(error?.response?.data?.message || "error occurred while accepting requests");
   }
}

export const onGetuserFreinds = async () => {
   try {
      const get_user_friends_api_url = `/users/getUserFriends`;
      const result = await axiosClient.get(get_user_friends_api_url);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while getting user friend list"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}

export const onCreateGroup = async (body) => {
   try {
      const create_group_api_url = `/chats/createGroup`;
      const result = await axiosClient.post(create_group_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while creating group"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}