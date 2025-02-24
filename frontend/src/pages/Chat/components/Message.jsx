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
      <div className={`relative flex ${myMessage && "flex-row-reverse"} items-start gap-2.5`}>
         <Avatar className="!w-[30px]" src={getUserAvatar(sender)} />
         <div className={`mt-3 flex flex-col gap-2 w-fit max-w-[220px] sm:max-w-[320px] leading-1.5 py-2 px-4 border-gray-200 bg-message-light ${myMessage ? "rounded-s-xl rounded-ee-xl" : "rounded-e-xl rounded-es-xl"} dark:bg-message-dark`}>
            {/* <div className="flex items-center space-x-2 rtl:space-x-reverse">
               <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
               <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
            </div> */}

            {
               !editMessage &&
               <span className="text-sm font-normal text-gray-900 dark:text-white whitespace-pre-wrap break-all">
                  {text}
               </span>
            }

            {
               !editMessage &&
               <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {getTime(createdAt)}
               </span>
            }

            {
               editMessage &&
               <AutoResizeableTextarea
                  className="w-full min-w-[200px] p-2 bg-transparent text-sm sm:text-[1rem] text-dark-primary dark:text-light-primary placeholder-dark-primary dark:placeholder-light-primary rounded-lg"
                  placeholder="Type here..."
                  maxHeight={80}
                  disabled={loading}
                  value={editMessageText}
                  onChange={(e) => setEditMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
               />
            }

            {
               editMessage &&
               <div className="flex justify-end items-center gap-2">
                  <button
                     className="py-1 w-full bg-white text-dark-secondary font-semibold rounded-md"
                     onClick={() => setEditMessage(false)}
                     disabled={loading}
                  >
                     Cancel
                  </button>
                  <button
                     className="py-1 w-full bg-yellow-300 text-dark-secondary font-semibold rounded-md"
                     onClick={editMessageHandler}
                     disabled={loading}
                  >
                     {
                        loading ? <Loader /> : "Edit"
                     }
                  </button>
               </div>
            }

            {
               myMessage &&
               <Dropdown
                  className="absolute top-5 right-10"
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
                  <MoreOutlined className="text-white" />
               </Dropdown>
            }
         </div>

         <CustomModal open={modalVisibility}>
            <ConfirmationModal
               text="Are you sure you want to delete this message ?"
               onCancel={onCloseModal}
               onOk={deleteMessageHandler}
            />
         </CustomModal>
      </div>
   )
};

export default Message;
