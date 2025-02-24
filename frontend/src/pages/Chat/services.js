import axiosClient from "../../utils/axiosClient";
import { errorResponse, successResponse } from "../../utils/responseWrapper";


export const onGetChats = async () => {
   try {
      const get_chats_api_url = `/chats`;
      const result = await axiosClient.get(get_chats_api_url);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while fetching chats"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}

export const onGetMessages = async (chatId) => {
   try {
      const get_messages_api_url = `/messages/${chatId}`;
      const result = await axiosClient.get(get_messages_api_url);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while fetching messages"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}

export const onGetPaginatedMessages = async (chatId, page) => {
   try {
      const get_paginated_messages_api_url = `/messages/getPaginatedMessages/${chatId}?page=${page}`;
      const result = await axiosClient.get(get_paginated_messages_api_url);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while fetching paginated messages"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}

export const onSendMessage = async (chatId, body) => {
   try {
      const send_message_api_url = `/messages/${chatId}`;
      const result = await axiosClient.post(send_message_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while sending message"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}

export const onEditMessage = async (messageId, body) => {
   try {
      const edit_message_api_url = `/messages/${messageId}`;
      const result = await axiosClient.put(edit_message_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while editing message"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}

export const onDeleteMessage = async (messageId) => {
   try {
      const delete_message_api_url = `/messages/${messageId}`;
      const result = await axiosClient.delete(delete_message_api_url);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while deleting message"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}

export const onEditGroup = async (groupId, body) => {
   try {
      const edit_group_api_url = `/chats/editGroup/${groupId}`;
      const result = await axiosClient.put(edit_group_api_url, body);
      return successResponse(result.data);
   } catch (error) {
      const errorMessage = "error occurred while editing group chat"
      console.log(errorMessage, error);
      return errorResponse(error?.response?.data?.message || errorMessage);
   }
}