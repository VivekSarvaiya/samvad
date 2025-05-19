import { useDispatch, useSelector } from "react-redux";
import { closeChatFriendDrawer, openChatFriendDrawer } from "../../redux/slices/appConfigSlice";
import ChatFriends from "./components/ChatFriends";
import ChatMessages from "./components/ChatMessages";
import Header from "../../components/Header";
import Drawer from "antd/lib/drawer";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const Chat = () => {

   const { showChatFriendDrawer } = useSelector(state => state.appConfigReducer);
   const dispatch = useDispatch();

   useEffect(() => {
      // Request permission to show notifications
      if ("Notification" in window) {
         Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
               console.log("Notification permission granted!");
            } else {
               console.log("Notification permission denied.");
            }
         });
      } else {
         console.log("Notifications are not supported by this browser.");
      }
   }, []);

   return (
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
         <Header showDrawer={() => dispatch(openChatFriendDrawer())} />

         <div className="flex flex-1 overflow-hidden">
            <div className="hidden md:block w-1/6 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
               <ChatFriends />
            </div>
            <div className="flex-1">
               <ChatMessages />
            </div>
         </div>

         <Drawer
            open={showChatFriendDrawer}
            onClose={() => dispatch(closeChatFriendDrawer())}
            placement="left"
            closable={true}
            closeIcon={<CloseOutlined className="text-white text-xl absolute right-4" />}
            className="block md:hidden"
            classNames={{ wrapper: "block md:hidden" }}
         >
            <ChatFriends />
         </Drawer>
      </div>
   )
};

export default Chat;
