import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setMessagesLoading, setSelectedChat } from "../../../redux/slices/chatSlice";
import { closeChatFriendDrawer } from "../../../redux/slices/appConfigSlice";
import useChats from "../hooks/useChats";
import Friend from "./Friend";
import Loader from "../../../components/Loader";
import { SearchOutlined } from "@ant-design/icons";
import filterChatFriendsBasedOnSearch from "../utils/filterChatFriendsBasedOnSearch";

const ChatFriends = ({ className }) => {

   const { loading } = useChats();

   const { userId } = useSelector(state => state.appConfigReducer);

   const { chatList } = useSelector(state => state.chatReducer);

   const [search, setSearch] = useState("");
   const [filteredChat, setFilteredChat] = useState(null);

   const dispatch = useDispatch();

   const onChatClick = (chat) => {
      dispatch(setMessagesLoading(true));
      dispatch(closeChatFriendDrawer());
      dispatch(setSelectedChat(chat));
   }

   useEffect(() => {
      let timeout;

      if (chatList && search && userId) {
         timeout = setTimeout(() => {
            const searchedChat = filterChatFriendsBasedOnSearch(chatList, search, userId);
            setFilteredChat(searchedChat);
         }, 800)
      }
      else {
         setFilteredChat(chatList);
      }

      return () => {
         if (timeout) {
            clearTimeout(timeout);
         }
      }
   }, [chatList, search, userId])

   return (
      <div className={`flex flex-col w-full h-full divide-y divide-dark-primary dark:divide-dark-secondary-200 ${className}`}>

         <div className="px-4 py-[9px] dark:py-[10px]">
            <div className="transition-none p-2 rounded-md border border-light-secondary dark:border-0 dark:bg-dark-secondary flex justify-center items-center gap-2">
               <SearchOutlined className="leading-[0] text-xl text-dark-primary dark:text-light-primary" />
               <input
                  type="text"
                  className="h-6 transition-none w-full text-sm sm:text-[1rem] border-none outline-none bg-inherit text-dark-primary dark:text-light-primary placeholder-dark-primary dark:placeholder-light-primary"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>



         <div className="flex-1 overflow-auto divide-y divide-light-secondary dark:divide-dark-primary">

            {
               loading &&
               <Loader />
            }

            {
               (!filteredChat?.length && !loading) &&
               <div className="w-full h-full grid place-items-center text-light-primary text-sm sm:text-xl">
                  No Friends
               </div>
            }

            {
               filteredChat?.map((chat) => {
                  return (
                     <Friend key={chat._id} chat={chat} userId={userId} onChatClick={onChatClick} />
                  )
               })
            }
         </div>
      </div>
   )
};

export default ChatFriends;
