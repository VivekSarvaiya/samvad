import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replaceChat, setMessages, setMessagesLoading, setScrollToLastMessage } from "../../../redux/slices/chatSlice";
import { onGetMessages } from "../services";
import toast from "react-hot-toast";

const useMessages = () => {

   const { selectedChat } = useSelector(state => state.chatReducer);

   const dispatch = useDispatch();

   const fetchChatmessages = async () => {
      if (!selectedChat || !selectedChat?._id) return;

      dispatch(setMessagesLoading(true));

      const response = await onGetMessages(selectedChat._id)

      if (response.success) {
         dispatch(setMessages(response.data.data.messages));
         dispatch(replaceChat(response.data.data.chat));
         dispatch(setScrollToLastMessage(true));
      }
      else {
         toast.error(response.message);
      }

      dispatch(setMessagesLoading(false));
   }

   useEffect(() => {
      const timeout = setTimeout(() => {
         fetchChatmessages()
      }, 800);

      return () => {
         clearTimeout(timeout)
      }
   }, [selectedChat])
};

export default useMessages;
