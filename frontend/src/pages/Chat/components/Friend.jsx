import Avatar from "../../../components/Avatar";
import getChatDetails from "../utils/getChatDetails";

const Friend = ({ chat, userId, onChatClick = () => { } }) => {

   const { chatName, chatAvatar, lastMessage, lastMessageTime, unread } = getChatDetails(chat, userId)

   return (
      <div
         className="p-3 flex items-center border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
         onClick={() => onChatClick(chat)}
      >
         <div className="relative">
            <Avatar
               src={chatAvatar}
               className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium"
            />
            {chat?.status === 'online' && (
               <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-700"></div>
            )}
         </div>

         <div className="ml-3 flex-1">
            <div className="flex justify-between items-center">
               <span className="font-medium text-gray-900 dark:text-white capitalize">{chatName}</span>
               {unread > 0 && (
                  <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                     {unread}
                  </span>
               )}
            </div>
            {lastMessage && (
               <p className="text-sm text-gray-500 dark:text-gray-400 text-ellipsis overflow-hidden">
                  {lastMessage}
               </p>
            )}
            {lastMessageTime && (
               <p className="text-xs text-gray-400 mt-1">
                  {lastMessageTime}
               </p>
            )}
         </div>
      </div>
   )
};

export default Friend;
