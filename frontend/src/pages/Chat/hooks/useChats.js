import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onGetChats } from "../services";
import { setChatList } from "../../../redux/slices/chatSlice";
import toast from "react-hot-toast";

const useChats = () => {

   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);

   const fetchChats = async () => {

      setLoading(true);

      const response = await onGetChats();

      if (response.success) {
         dispatch(setChatList(response.data.data.chats))
      }
      else {
         toast.error(response.message);
      }

      setLoading(false);
   }

   useEffect(() => {
      fetchChats();
   }, [])

   return { loading };
};

export default useChats;
