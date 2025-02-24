import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import useMyProfile from "../hooks/useMyProfile";
import getUserAvatar from "../utils/getUserAvatar";
import Dropdown from "antd/lib/dropdown";
import {
   MoonOutlined, SunOutlined, UserAddOutlined, UsergroupAddOutlined, MenuOutlined
} from "@ant-design/icons";
import CustomModal from "./CustomModal";
import { setModalChild, setModalVisibility } from "../redux/slices/appConfigSlice";
import AddFriend from "./AddFriend";
import useRequests from "../hooks/useRequests";
import useSocket from "../hooks/useSocket";
import Request from "../pages/Chat/components/Request";
import { ACCESS_TOKEN, USER_DATA, removeLocalStorageItem } from "../utils/localStroageManager";
import { useNavigate } from "react-router-dom";
import GroupManager from "./GroupManager";
import CreateGroup from "./CreateGroup";

const Header = ({ showDrawer }) => {
   const {
      myProfile,
      modalVisibility,
      modalChild,
   } = useSelector(state => state.appConfigReducer);

   useMyProfile();
   useSocket();
   useRequests();

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const onOpenModal = (modalChild) => {
      dispatch(setModalChild(modalChild))
      dispatch(setModalVisibility(true));
   }

   const onCloseModal = () => {
      dispatch(setModalVisibility(false))
   }

   const toggleDarkMode = () => {
      const htmlTag = document.querySelector('html');
      htmlTag.classList.toggle("dark")
   };

   const logout = () => {
      removeLocalStorageItem(ACCESS_TOKEN, USER_DATA);
      navigate("/login");
   }

   const profilePic = useMemo(() => {
      return getUserAvatar(myProfile);
   }, [myProfile])

   const ModalChildren = {
      addFriend: <AddFriend onCloseModal={onCloseModal} />,
   }

   return (
      <div className="h-[60px] px-4 flex justify-between items-center">
         <div className="flex justify-center items-center gap-2">
            <MenuOutlined
               className="block md:hidden leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer"
               onClick={showDrawer}
            />
            <img
               className="w-[50px] object-cover"
               src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
               alt="logo"
            />
         </div>
         <div className="flex justify-center items-center gap-4">
            {/* <SunOutlined
               className="hidden dark:inline leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer"
               onClick={toggleDarkMode}
            />
            <MoonOutlined
               className="dark:hidden leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer"
               onClick={toggleDarkMode}
            /> */}

            <Request />

            <UserAddOutlined
               className="leading-[0] text-dark-primary dark:text-light-primary text-2xl cursor-pointer"
               onClick={() => onOpenModal("addFriend")}
            />
            <CreateGroup />

            <Dropdown
               menu={{
                  items: [
                     {
                        key: '1',
                        label: <p className="p-1 rounded-md bg-light-primary dark:bg-dark-secondary text-red-400 font-semibold text-center">Logout</p>,
                        style: { background: "none", padding: "0" },
                        onClick: logout
                     },
                  ],
               }}
               overlayStyle={{ top: "3.5rem", overflow: "hidden" }}
               trigger={['click']}
               placement="bottomRight"
            >
               <div className="flex justify-center items-center gap-2 cursor-pointer">
                  <Avatar src={profilePic} />
                  <span
                     className="hidden md:inline text-dark-primary dark:text-light-primary"
                  >
                     {myProfile?.username}
                  </span>
               </div>
            </Dropdown>
         </div>

         <CustomModal open={modalVisibility}>
            {
               ModalChildren[modalChild]
            }
         </CustomModal>
      </div>
   )
};

export default Header;
