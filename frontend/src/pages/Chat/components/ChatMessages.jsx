import { SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import ChatMessageHeader from "./ChatMessageHeader";
import useMessages from "../hooks/useMessages";
import Loader from "../../../components/Loader";
import AutoResizeableTextarea from "../../../components/AutoResizeableTextarea";
import { setMessageText, setScrollToLastMessage, setSendMessageLoading } from "../../../redux/slices/chatSlice";
import { onSendMessage } from "../services";
import toast from "react-hot-toast";
import MessagesWrapper from "./MessagesWrapper";
import { encryptMessage } from "../../../utils/encryption";

const ChatMessages = () => {

   useMessages();

   const { userId } = useSelector(state => state.appConfigReducer);
   const { selectedChat, messages, messagesLoading, messageText, sendMessageLoading } = useSelector(state => state.chatReducer);

   const dispatch = useDispatch();

   const sendMessage = async () => {

      if (!selectedChat?._id || !messageText?.trim()) return;

      dispatch(setSendMessageLoading(true));

      const body = {
         // text: encryptMessage(messageText)
         text: messageText
      }
      const response = await onSendMessage(selectedChat._id, body);

      if (response.success) {
         dispatch(setMessageText(""));
         dispatch(setScrollToLastMessage(true));
      }
      else {
         toast.error(response.message);
      }

      dispatch(setSendMessageLoading(false));
   }

   const handleKeyPress = (e) => {
      if (e.key === "Enter" && e.shiftKey) {
         e.preventDefault();

         // Insert a newline character at the cursor position
         const { selectionStart, selectionEnd } = e.target;
         const newText = `${messageText.substring(0, selectionStart)}\n${messageText.substring(selectionEnd)}`;
         dispatch(setMessageText(newText));

         // Move the cursor position after the inserted newline character
         e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
      }
      else if (e.key === "Enter") {
         e.preventDefault();
         sendMessage();
      }
   };

   if (messagesLoading) {
      return (
         <div className="w-full h-full flex flex-col divide-y divide-dark-primary dark:divide-dark-secondary-200">
            <div className="flex-1 text-light-primary flex justify-center items-center text-sm sm:text-xl">
               <Loader iconSize={30} />
            </div>
         </div>
      )
   }

   if (!selectedChat) {
      return (
         <div className="w-full h-full flex flex-col divide-y divide-dark-primary dark:divide-dark-secondary-200">
            <div className="flex-1 text-light-primary flex justify-center items-center text-sm sm:text-xl">
               Please select a chat
            </div>
         </div>
      )
   }

   return (
      <div className="w-full h-full flex flex-col divide-y divide-dark-primary dark:divide-dark-secondary-200">

         <ChatMessageHeader chat={selectedChat} userId={userId} />

         <MessagesWrapper messages={messages} userId={userId} selectedChat={selectedChat} />

         <div className="h-auto dark:bg-dark-primary p-2 mt-auto flex justify-center items-center gap-2">
            <AutoResizeableTextarea
               className="p-2 bg-transparent text-sm sm:text-[1rem] text-dark-primary dark:text-light-primary placeholder-dark-primary dark:placeholder-light-primary rounded-lg"
               placeholder="Type here..."
               maxHeight={80}
               disabled={sendMessageLoading}
               value={messageText}
               onChange={(e) => dispatch(setMessageText(e.target.value))}
               onKeyDown={handleKeyPress}
            />
            <button
               className="min-w-[40px] p-2 rounded-md group"
               disabled={sendMessageLoading}
               onClick={sendMessage}
            >
               <SendOutlined className="leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer translate-x-0 group-hover:translate-x-1" />
            </button>
         </div>
      </div>
   )
};

export default ChatMessages;
