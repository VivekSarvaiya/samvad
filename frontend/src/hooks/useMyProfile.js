import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { onGetMyProfile } from "../services";
import { USER_DATA, getLocalStorageItem, setLocalStorageItem } from "../utils/localStroageManager";
import { setMyProfile, setUserId } from "../redux/slices/appConfigSlice";

const useMyProfile = () => {

   const dispatch = useDispatch();

   const getMyProfile = async () => {
      const user = getLocalStorageItem(USER_DATA)
      if (user) {
         dispatch(setMyProfile(user));
         dispatch(setUserId(user._id))
         return;
      }

      const response = await onGetMyProfile();

      if (response.success) {
         setLocalStorageItem(USER_DATA, response.data.data.user)
         dispatch(setMyProfile(response.data.data.user));
         dispatch(setUserId(response.data.data.user._id))
      }
      else {
         toast.error(response.message);
      }
   }

   useEffect(() => {
      getMyProfile()
   }, [])

};

export default useMyProfile;
