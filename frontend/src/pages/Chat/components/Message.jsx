import { useMemo, useState } from "react";
import Avatar from "../../../components/Avatar";
import getUserAvatar from "../../../utils/getUserAvatar";
import getTime from "../../../utils/getTime";
import { MoreOutlined } from '@ant-design/icons';
import AutoResizeableTextarea from "../../../components/AutoResizeableTextarea";
import Dropdown from 'antd/lib/dropdown';
import { onDeleteMessage, onEditMessage } from "../services";
import toast from "react-hot-toast";
import Loader from "../../../components/Loader";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";

const Message = ({ message, userId }) => {

   const { _id, text, sender, createdAt } = message;

   const [editMessage, setEditMessage] = useState(false);
   const [loading, setLoading] = useState(false);
   const [editMessageText, setEditMessageText] = useState(text);
   const [modalVisibility, setModalVisibility] = useState(false);

   const onCloseModal = () => {
      if (loading) return;
      setModalVisibility(false);
   }

   const deleteMessageHandler = async () => {

      if (loading) return;

      setLoading(true);

      const res = await onDeleteMessage(_id);

      if (!res.success) {
         toast.error(res.message);
      }

      setLoading(false);
      onCloseModal();
   }

   const editMessageHandler = async () => {

      if (!editMessageText || editMessageText?.trim() === text?.trim()) return;

      setLoading(true);

      const body = {
         text: editMessageText
      }
      const res = await onEditMessage(_id, body);

      if (res.success) {
         setEditMessage(false);
      }
      else {
         toast.error(res.message);
      }

      setLoading(false);
   }

   const handleKeyPress = (e) => {
      if (e.key === "Enter" && e.shiftKey) {
         e.preventDefault();

         // Insert a newline character at the cursor position
         const { selectionStart, selectionEnd } = e.target;
         const newText = `${messageText.substring(0, selectionStart)}\n${messageText.substring(selectionEnd)}`;
         setEditMessageText(newText);

         // Move the cursor position after the inserted newline character
         e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
      }
      else if (e.key === "Enter") {
         e.preventDefault();
         editMessageHandler();
      }
   };

   const myMessage = useMemo(() => {
      return sender?._id == userId
   }, [message, userId])

   return (
      <div className={`flex my-2 ${myMessage ? 'justify-end' : 'justify-start'}`}>
         {!myMessage && (
            <Avatar
               src={getUserAvatar(sender)}
               className="h-8 w-8 rounded-full mr-2"
            />
         )}

         <div className="relative group">
            <div
               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${myMessage
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                  }`}
            >
               {!editMessage && (
                  <p className="whitespace-pre-wrap break-words">{text}</p>
               )}

               {editMessage && (
                  <AutoResizeableTextarea
                     className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg"
                     placeholder="Edit message..."
                     maxHeight={80}
                     disabled={loading}
                     value={editMessageText}
                     onChange={(e) => setEditMessageText(e.target.value)}
                     onKeyDown={handleKeyPress}
                  />
               )}

               <div className={`text-xs mt-1 flex justify-end ${myMessage ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                  {getTime(createdAt)}
               </div>

               {editMessage && (
                  <div className="flex justify-end items-center gap-2 mt-2">
                     <button
                        className="py-1 px-3 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md"
                        onClick={() => setEditMessage(false)}
                        disabled={loading}
                     >
                        Cancel
                     </button>
                     <button
                        className="py-1 px-3 bg-indigo-600 text-white rounded-md"
                        onClick={editMessageHandler}
                        disabled={loading}
                     >
                        {loading ? <Loader /> : "Save"}
                     </button>
                  </div>
               )}
            </div>

            {myMessage && !editMessage && (
               <Dropdown
                  className="opacity-0 group-hover:opacity-100 absolute top-2 right-full mr-2"
                  menu={{
                     items: [
                        {
                           label: <span onClick={() => setEditMessage(true)}>Edit message</span>,
                           key: '1',
                        },
                        {
                           label: <span onClick={() => setModalVisibility(true)}>Delete message</span>,
                           key: '2',
                        },
                     ],
                  }}
                  trigger={['click']}
                  placement="bottomRight"
               >
                  <MoreOutlined className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 cursor-pointer" />
               </Dropdown>
            )}
         </div>

         {myMessage && (
            <Avatar
               src={getUserAvatar(sender)}
               className="h-8 w-8 rounded-full ml-2"
            />
         )}

         <CustomModal open={modalVisibility}>
            <ConfirmationModal
               text="Are you sure you want to delete this message?"
               onCancel={onCloseModal}
               onOk={deleteMessageHandler}
            />
         </CustomModal>
      </div>

   )
};

export default Message;
