import React, { useState } from 'react';
import CustomModal from './CustomModal';
import { UsergroupAddOutlined } from '@ant-design/icons';
import GroupManager from './GroupManager';
import { onCreateGroup } from '../services';
import toast from 'react-hot-toast';

const CreateGroup = () => {

   const [modalVisibility, setModalVisibility] = useState(false);
   const [groupName, setGroupName] = useState("");
   const [groupMembers, setGroupMembers] = useState([]);

   const onCloseModal = () => {
      setModalVisibility(false);
   }

   const createGroupHandler = async () => {

      if (!groupName) {
         toast.error("Group name is required");
         return;
      }

      if (groupMembers.length < 2) {
         toast.error("Please add atleast 2 members");
         return;
      }

      if (groupMembers.length > 10) {
         toast.error("Only 10 members are allowed");
         return;
      }

      const members = groupMembers.map((member) => member._id);

      const body = {
         members,
         groupName
      }

      const response = await onCreateGroup(body);

      if (response.success) {
         toast.success("Group created");
         onCloseModal();
      }
      else {
         toast.error(response.message);
      }
   }

   return (
      <>
         <UsergroupAddOutlined
            className="leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer"
            onClick={() => setModalVisibility(true)}
         />

         <CustomModal open={modalVisibility}>
            <GroupManager
               groupName={groupName}
               setGroupName={setGroupName}
               groupMembers={groupMembers}
               setGroupMembers={setGroupMembers}
               onCloseModal={onCloseModal}
               onSubmitHandler={createGroupHandler}
               resetForm={true}
            />
         </CustomModal>
      </>
   )
}

export default CreateGroup