import { useDispatch, useSelector } from "react-redux";
import { BellOutlined } from "@ant-design/icons";
import Popover from "antd/lib/popover";
import { removeRecievedRequests, removeSentRequests, setSelectedRequestId } from "../../../redux/slices/appConfigSlice";
import toast from "react-hot-toast";
import RequestOverlay from "./RequestOverlay";
import CustomModal from "../../../components/CustomModal";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { onAcceptRequests, onDeleteRequests } from "../../../services";
import { useState } from "react";
import { addChat } from "../../../redux/slices/chatSlice";

const Request = () => {

   const {
      selectedRequestId,
   } = useSelector(state => state.appConfigReducer);

   const [modalVisibility, setModalVisibility] = useState(false);
   const [modalChild, setModalChild] = useState("");

   const { recievedRequests, sentRequests } = useSelector(state => state.appConfigReducer);

   const dispatch = useDispatch();

   const onOpenModal = (modalChild) => {
      setModalChild(modalChild);
      setModalVisibility(true);
   }

   const onCloseModal = () => {
      setModalVisibility(false);
   }

   const acceptRequest = (id) => {
      dispatch(setSelectedRequestId(id));
      onOpenModal("acceptRequest");
   }

   const deleteRequest = (id) => {
      dispatch(setSelectedRequestId(id));
      onOpenModal("deleteRequest");
   }

   const requestAccept = async () => {
      const toastId = toast.loading('Loading...');

      onCloseModal();

      const response = await onAcceptRequests(selectedRequestId)

      if (response.success) {
         dispatch(removeRecievedRequests(selectedRequestId));
         dispatch(addChat(response.data.data.chat));
         toast.success(response.data.message);
      }
      else {
         toast.error(response.message);
      }

      toast.dismiss(toastId);
   }

   const requestDelete = async () => {

      const toastId = toast.loading('Loading...');

      onCloseModal();

      const response = await onDeleteRequests(selectedRequestId)

      if (response.success) {
         dispatch(removeRecievedRequests(selectedRequestId));
         dispatch(removeSentRequests(selectedRequestId));
         toast.success(response.data.message);
      }
      else {
         toast.error(response.message);
      }

      toast.dismiss(toastId);
   }

   const ModalChildren = {
      acceptRequest: <ConfirmationModal
         text="Are you sure you want to accept this request ?"
         onCancel={onCloseModal}
         onOk={requestAccept}
      />,
      deleteRequest: <ConfirmationModal
         text="Are you sure you want to delete this request ?"
         onCancel={onCloseModal}
         onOk={requestDelete}
      />,
   }

   return (
      <>
         <Popover
            content={
               <RequestOverlay
                  recievedRequests={recievedRequests}
                  sentRequests={sentRequests}
                  acceptRequest={acceptRequest}
                  deleteRequest={deleteRequest}
               />
            }
            placement="bottom"
            trigger="click"
            overlayInnerStyle={{ padding: "0", background: "none" }}
         >
            <div className="relative">
               <BellOutlined
                  className="leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer"
               />
               {
                  recievedRequests?.length > 0 &&
                  <div className="w-1 h-1 p-1 rounded-full absolute top-0 right-0 bg-red-500"></div>
               }

            </div>
         </Popover>

         <CustomModal open={modalVisibility}>
            {
               ModalChildren[modalChild]
            }
         </CustomModal>
      </>
   )
};

export default Request;
