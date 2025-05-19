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
            <div className="flex-1 dark:text-light-primary flex justify-center items-center text-sm sm:text-xl">
               Please select a chat
            </div>
         </div>
      )
   }

   return (
      <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
         <ChatMessageHeader chat={selectedChat} userId={userId} />

         <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
               <MessagesWrapper messages={messages} userId={userId} selectedChat={selectedChat} />
               {/* <div ref={messagesEndRef} /> */}
            </div>
         </div>

         <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end space-x-2">
               {/* <button className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                  <PaperClipOutlined className="h-6 w-6" />
               </button> */}
               <div className="flex-1 relative">
                  <AutoResizeableTextarea
                     className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                     placeholder="Type a message..."
                     maxHeight={80}
                     disabled={sendMessageLoading}
                     value={messageText}
                     onChange={(e) => dispatch(setMessageText(e.target.value))}
                     onKeyDown={handleKeyPress}
                  />
                  {/* <button className="absolute right-2 bottom-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                     <SmileOutlined className="h-5 w-5" />
                  </button> */}
               </div>
               <button
                  onClick={sendMessage}
                  disabled={sendMessageLoading}
                  className="rounded-full p-2 hover:text-indigo-700 dark:hover:text-indigo-700 dark:text-white focus:outline-none"
               >
                  <SendOutlined className="h-5 w-5" />
               </button>
            </div>
         </div>
      </div>

   )
};

export default ChatMessages;
