import Avatar from "../../../components/Avatar";
import getChatDetails from "../utils/getChatDetails";

const Friend = ({ chat, userId, onChatClick = () => { } }) => {

   const { chatName, chatAvatar, lastMessage, lastMessageTime, unread } = getChatDetails(chat, userId)

   return (
      <div
         className="w-full p-2 grid grid-cols-12 gap-2 bg-light-secondary-200 dark:bg-dark-secondary hover:bg-light-secondary dark:hover:bg-dark-secondary-200 cursor-pointer"
         onClick={() => onChatClick(chat)}
      >
         <div className="col-span-2 m-auto">
            <Avatar src={chatAvatar} />
         </div>
         <div className="col-span-8 flex flex-col justify-center">
            <p className="text-dark-primary dark:text-light-primary capitalize">{chatName}</p>
            {
               lastMessage &&
               <p className="text-dark-primary dark:text-light-secondary-300 text-ellipsis overflow-hidden">{lastMessage}</p>
            }

         </div>
         <div className="pr-4 col-span-2 flex flex-col justify-center items-center gap-2">
            {
               lastMessageTime &&
               <p className="text-xs text-light-secondary-300 font-semibold whitespace-nowrap">
                  {lastMessageTime}
               </p>
            }
            {
               !!unread &&
               <div
                  className="w-5 h-5 text-xs grid place-items-center rounded-full text-white bg-dark-secondary-300"
               >
                  {unread}
               </div>
            }
         </div>
      </div>
   )
};

export default Friend;
