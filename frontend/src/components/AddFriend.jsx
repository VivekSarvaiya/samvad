import Input from "antd/lib/input";
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { onSearchUsers, onSendRequest } from "../services";
import getUserAvatar from "../utils/getUserAvatar";
import { useDispatch } from "react-redux";
import { addNewSentRequest } from "../redux/slices/appConfigSlice";

const AddFriend = ({ onCloseModal }) => {

   const [username, setUsername] = useState("");
   const [loading, setLoading] = useState(false);
   const [users, setUsers] = useState(null);

   const dispatch = useDispatch();

   const fetchUsersByUsername = async (username) => {
      if (!username) {
         setUsers(null)
         return;
      }
      setLoading(true)
      const response = await onSearchUsers(username);

      if (response.success) {
         setUsers(response.data.data.users)
      }
      else {
         toast.error(response.message);
      }

      setLoading(false)
   }

   const sendRequest = async (userId) => {

      if (!userId) return;

      setLoading(true)

      const body = {
         requestedTo: userId
      }

      const response = await onSendRequest(body);

      if (response.success) {
         const newRequest = response.data.data.request;
         if (newRequest) {
            dispatch(addNewSentRequest(newRequest))
         }
         toast.success(response.data.message);
      }
      else {
         toast.error(response.message);
      }

      setLoading(false)
   }

   useEffect(() => {
      const timeout = setTimeout(() => {
         fetchUsersByUsername(username)
      }, 800)

      return () => {
         clearTimeout(timeout)
      }
   }, [username])

   return (
      <div
         className="relative py-4 px-2 bg-gray-50 dark:bg-gray-900 min-w-[220px] sm:min-w-[400px] space-y-2 rounded-lg"
      >
         <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={onCloseModal}
         >
            <CloseOutlined
               className="dark:text-light-secondary text-[1rem]"
            />
         </div>

         <h2
            className="text-sm sm:text-xl text-center text-dark-secondary dark:text-light-secondary"
         >
            Add Friend
         </h2>


         <div className="p-3">
            <div className="relative">
               <input
                  placeholder="username"
                  disabled={loading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
               />
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchOutlined className="h-4 w-4 text-gray-400" />
               </div>
            </div>
         </div>

         <div
            className="px-4 text-light-primary w-full max-h-[400px] overflow-auto"
         >
            {
               users?.map((user) => {
                  return (
                     <div key={user._id} className="py-2 flex justify-between items-center">
                        <div className="flex justify-center items-center gap-1">
                           <Avatar src={getUserAvatar(user)} />
                           <span
                              className="hidden md:inline text-dark-primary dark:text-light-primary"
                           >
                              {user.username}
                           </span>
                        </div>
                        <button
                           className="py-1 px-2 bg-light-secondary-200 text-dark-secondary-200 rounded-lg hover:font-semibold disabled:bg-dark-secondary-300"
                           disabled={loading}
                           onClick={() => sendRequest(user._id)}
                        >
                           Add
                        </button>
                     </div>
                  )
               })
            }

            {
               (!users || users.length === 0) &&
               <div className="py-4 w-full grid place-items-center">No result</div>
            }

         </div>
      </div>
   )
};

export default AddFriend;
