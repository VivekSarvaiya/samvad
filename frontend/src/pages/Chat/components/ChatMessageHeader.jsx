import Avatar from "../../../components/Avatar";
import { MoreOutlined } from "@ant-design/icons";
import getChatDetails from "../utils/getChatDetails";
import { Dropdown } from "antd";
import EditGroup from "./EditGroup";

const ChatMessageHeader = ({ chat, userId }) => {
   const { chatName, chatAvatar } = getChatDetails(chat, userId)
   return (
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
         <div className="relative">
            <Avatar
               src={chatAvatar}
               className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium"
            />
            {chat?.status === 'online' && (
               <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-700"></div>
            )}
         </div>

         <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{chatName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               {chat?.status === 'online' ? 'Online' : chat?.lastSeen ? `Last seen ${chat.lastSeen}` : ''}
            </p>
         </div>

         <div className="ml-auto flex space-x-3">
            {/* <button className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
               <PhoneOutlined className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
               <VideoCameraOutlined className="h-5 w-5" />
            </button> */}

            {chat?.type === "group" && chat?.creator === userId && (
               <Dropdown
                  menu={{
                     items: [
                        {
                           label: <EditGroup chat={chat} userId={userId} />,
                           key: '1',
                        },
                     ],
                  }}
                  trigger={['click']}
                  placement="bottomLeft"
               >
                  <MoreOutlined className="h-5 w-5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 cursor-pointer" />
               </Dropdown>
            )}
         </div>
      </div>

   )
};

export default ChatMessageHeader;
