import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onGetRequests } from "../services";
import toast from "react-hot-toast";
import { setRecievedRequests, setSentRequests } from "../redux/slices/appConfigSlice";


const useRequests = () => {
   const dispatch = useDispatch();

   const getRequests = async () => {


      const response = await onGetRequests();

      if (response.success) {
         const recievedRequests = response.data.data.recievedRequests;
         const sentRequests = response.data.data.sentRequests;
         dispatch(setRecievedRequests(recievedRequests));
         dispatch(setSentRequests(sentRequests));
      }
      else {
         toast.error(response.message);
      }
   }

   useEffect(() => {
      getRequests()
   }, [])
};

export default useRequests;
