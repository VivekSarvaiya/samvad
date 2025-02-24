import React, { useEffect, useState } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Input from "antd/lib/input";
import { onGetuserFreinds } from '../services';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setFriends } from '../redux/slices/connectionSlice';
import Avatar from './Avatar';
import getUserAvatar from '../utils/getUserAvatar';

const GroupManager = ({
    heading = "CREATE GROUP",
    submitBtnText = "CREATE",
    groupName = "",
    setGroupName = () => { },
    groupMembers = [],
    setGroupMembers = () => { },
    onCloseModal = () => { },
    onSubmitHandler = () => { },
    resetForm = false
}) => {

    const { friends } = useSelector(state => state.connectionReducer);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [addedMembersId, setAddedMembersId] = useState({});
    const [filteredFriends, setFilteredFriends] = useState(null);

    const dispatch = useDispatch();

    const fetchUserFriends = async () => {
        setLoading(true);
        const response = await onGetuserFreinds();
        if (response.success) {
            dispatch(setFriends(response.data.data.friends));
            setFilteredFriends(response.data.data.friends);
        }
        else {
            toast.error(response.message);
        }
        setLoading(false);
    }

    const addToGroupHandler = (friend) => {
        if (groupMembers.length >= 10) {
            toast.error("Only 10 members are allowed");
            return;
        }

        if (!addedMembersId[friend._id]) {
            setAddedMembersId((prev) => {
                const updatedAddedMembersId = { ...prev, [friend._id]: true };
                return updatedAddedMembersId;
            })
            setGroupMembers((prev) => prev = [...prev, friend]);
        }
    }

    const removeFromGroupMembers = (friend) => {
        if (addedMembersId[friend._id]) {
            setAddedMembersId((prev) => {
                const updatedAddedMembersId = { ...prev };
                delete updatedAddedMembersId[friend._id];
                return updatedAddedMembersId;
            })
            setGroupMembers((prev) => prev = prev.filter((addedFriend) => addedFriend._id != friend._id));
        }
    }

    const filterFriends = (friends = null, search = "") => {
        if (!friends || !search) return friends;

        return friends.filter((friend) => friend?.username?.toLowerCase()?.includes(search?.toLowerCase()))
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            const filteredFriends = filterFriends(friends, search);
            setFilteredFriends(filteredFriends);
        }, 800)

        return () => {
            clearTimeout(timeout);
        }
    }, [friends, search])

    useEffect(() => {
        if (resetForm) {
            setGroupName("");
            setSearch("");
            setGroupMembers([]);
            setAddedMembersId({});
        }
        else {
            groupMembers?.forEach((member) => {
                setAddedMembersId((prev) => {
                    const updatedAddedMembersId = { ...prev, [member._id]: true };
                    return updatedAddedMembersId;
                })
            })
        }
        fetchUserFriends();
    }, [])

    return (
        <div className="relative py-4 px-2 bg-secondary min-w-[220px] sm:min-w-[400px] flex flex-col gap-2 rounded-lg bg-dark-secondary">
            <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={onCloseModal}
            >
                <CloseOutlined
                    className="text-light-secondary text-[1rem]"
                />
            </div>

            <h2 className="text-sm sm:text-xl text-center text-light-secondary">{heading}</h2>

            <div className='mb-4 w-full flex flex-col justify-center gap-2'>
                <p className='text-sm text-light-secondary font-semibold'>Group name</p>
                <Input
                    placeholder="Enter group name"
                    value={groupName}
                    disabled={loading}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </div>

            <Input
                placeholder="Search freinds"
                prefix={<SearchOutlined />}
                value={search}
                disabled={loading}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className='flex flex-wrap gap-2'>
                {
                    groupMembers?.map((member) => {
                        return (
                            <div key={member._id} className="w-fit p-2 flex flex-wrap items-center gap-2 border rounded-full">
                                <div className="flex justify-center items-center gap-1">
                                    <Avatar className='!w-[25px]' src={getUserAvatar(member)} />
                                    <span
                                        className="text-sm text-light-primary"
                                    >
                                        {member.username}
                                    </span>
                                </div>
                                <CloseOutlined
                                    className="text-light-secondary text-[1rem]"
                                    onClick={() => removeFromGroupMembers(member)}
                                />
                            </div>
                        )
                    })
                }
            </div>


            <div
                className="px-4 text-light-primary w-full max-h-[400px] overflow-auto"
            >
                <p className='text-sm sm:text-xl text-center text-light-secondary'>Friends</p>
                {
                    filteredFriends?.map((friend) => {
                        if (addedMembersId[friend._id]) {
                            return <React.Fragment key={friend._id}></React.Fragment>
                        }
                        return (
                            <div key={friend._id} className="py-2 flex justify-between items-center">
                                <div className="flex justify-center items-center gap-1">
                                    <Avatar src={getUserAvatar(friend)} />
                                    <span
                                        className="text-light-primary"
                                    >
                                        {friend.username}
                                    </span>
                                </div>
                                <button
                                    className="py-1 px-2 bg-dark-secondary-200 text-secondary-200 rounded-lg hover:font-semibold disabled:bg-secondary-300"
                                    disabled={loading}
                                    onClick={() => addToGroupHandler(friend)}
                                >
                                    Add
                                </button>
                            </div>
                        )
                    })
                }

                {
                    (!filteredFriends || filteredFriends.length === 0) &&
                    <div className="py-4 w-full grid place-items-center">No result</div>
                }

                <div className="mt-4 flex justify-between items-center gap-2">
                    <button
                        className="py-2 w-full bg-secondary-200 text-light-primary font-semibold rounded-md"
                        onClick={onCloseModal}
                    >
                        CANCEL
                    </button>
                    <button
                        className="py-2 w-full bg-yellow-300 text-secondary font-semibold rounded-md text-dark-secondary"
                        disabled={loading || groupMembers.length < 2}
                        onClick={onSubmitHandler}
                    >
                        {submitBtnText}
                    </button>
                </div>

            </div>
        </div>
    )
};

export default GroupManager;
