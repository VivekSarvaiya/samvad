import Avatar from "../../../components/Avatar";
import { MoreOutlined } from "@ant-design/icons";
import getChatDetails from "../utils/getChatDetails";
import { Dropdown } from "antd";
import EditGroup from "./EditGroup";
import useVideoChat from "../../../hooks/useVideoChat";
import VideoPlayer from "../../../components/VideoPlayer";

const ChatMessageHeader = ({ chat, userId }) => {
   const { callUser } = useVideoChat();
   const { chatName, chatAvatar } = getChatDetails(chat, userId)
   console.log(chat);
   const to = chat?.members?.find((user) => user._id !== userId);
   return (
      <div className="bg-light-secondary-200 dark:bg-dark-secondary px-4 py-2 flex justify-between items-center">
         <div className="flex justify-center items-center gap-2">
            <Avatar src={chatAvatar} />
            <span className="text-dark-primary dark:text-light-primary">{chatName}</span>
         </div>
         {
            chat?.type == "group" && chat?.creator == userId &&
            <div className="flex justify-center items-center">
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
                  <MoreOutlined className="leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer" />
               </Dropdown>
            </div>
         }
         <VideoPlayer />
         <button onClick={() => callUser(chatName, to._id, userId)}>Video Call</button>
      </div>
   )
};

export default ChatMessageHeader;
