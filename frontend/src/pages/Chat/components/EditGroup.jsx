import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import GroupManager from '../../../components/GroupManager';
import CustomModal from '../../../components/CustomModal';
import { onEditGroup } from '../services';

const EditGroup = ({ chat, userId }) => {

    const [modalVisibility, setModalVisibility] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);

    const onCloseModal = () => {
        setModalVisibility(false);
    }

    const editGroupHandler = async () => {

        if (!chat?._id) return;

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

        const response = await onEditGroup(chat._id, body);

        if (response.success) {
            toast.success("Group edited");
            onCloseModal();
        }
        else {
            toast.error(response.message);
        }
    }

    useEffect(() => {
        setGroupName(chat?.groupName || "");
        setGroupMembers(() => {
            if (!chat?.members) return [];

            return chat?.members?.filter((member) => member?._id != userId);
        });
    }, [chat])

    return (
        <>
            <span onClick={() => setModalVisibility(true)}>Edit group</span>

            <CustomModal open={modalVisibility}>
                <GroupManager
                    heading={"EDIT GROUP"}
                    submitBtnText={"EDIT"}
                    groupName={groupName}
                    setGroupName={setGroupName}
                    groupMembers={groupMembers}
                    setGroupMembers={setGroupMembers}
                    onCloseModal={onCloseModal}
                    onSubmitHandler={editGroupHandler}
                />
            </CustomModal>
        </>
    )
}

export default EditGroup