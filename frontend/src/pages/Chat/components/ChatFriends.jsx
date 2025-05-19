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
      <div className={`flex flex-col h-full bg-white dark:bg-gray-800 ${className}`}>
         <div className="p-3">
            <div className="relative">
               <input
                  type="text"
                  placeholder="Search conversations"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchOutlined className="h-4 w-4 text-gray-400" />
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {loading && <Loader />}

            {(!filteredChat?.length && !loading) && (
               <div className="w-full h-full grid place-items-center text-gray-500 dark:text-gray-400 text-sm sm:text-xl">
                  No Friends
               </div>
            )}

            {filteredChat?.map((chat) => (
               <Friend key={chat._id} chat={chat} userId={userId} onChatClick={onChatClick} />
            ))}
         </div>
      </div>
   )
};

export default ChatFriends;
