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
      <div className="bg-light-primary dark:bg-dark-primary divide-y divide-dark-primary dark:divide-dark-secondary-200">
         <Header showDrawer={() => dispatch(openChatFriendDrawer())} />

         <div className="h-[calc(100vh-60px)] flex divide-x divide-dark-primary dark:divide-dark-secondary-200">
            <div className="w-[0px] md:w-[500px] h-full">
               <ChatFriends className="hidden md:flex" />
            </div>
            <div className="w-full h-full">
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
