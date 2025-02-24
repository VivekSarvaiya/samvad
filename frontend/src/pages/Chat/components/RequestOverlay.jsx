import { useEffect, useState } from "react";
import Avatar from "../../../components/Avatar";
import CustomTabs from "../../../components/CustomTabs";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import getUserAvatar from "../../../utils/getUserAvatar";
import moment from "moment"

const RequestOverlay = ({ recievedRequests, sentRequests, acceptRequest = () => { }, deleteRequest = () => { } }) => {

   const [activeTab, setActiveTab] = useState(1);
   const [requests, setRequests] = useState(recievedRequests);

   const onTabChange = (key) => {
      setActiveTab(key)
   };

   useEffect(() => {
      if (activeTab === 1) {
         setRequests(recievedRequests);
      }
      else {
         setRequests(sentRequests);
      }
   }, [activeTab, recievedRequests, sentRequests])

   return (
      <div className="px-4 bg-light-primary dark:bg-dark-secondary text-light-primary w-[220px] sm:w-[300px] divide-y divide-dark-secondary rounded-lg max-h-[300px]">
         <CustomTabs
            className="w-full"
            items={
               [
                  {
                     key: 1,
                     label: "Recieved",
                  },
                  {
                     key: 2,
                     label: "Sent",
                  },
               ]
            }
            defaultActiveKey={1}
            activeKey={activeTab}
            onChange={onTabChange}
         />
         {
            !requests || requests.length === 0 &&
            <div className="w-full py-2">No requests</div>
         }
         {
            activeTab === 1 &&
            requests?.map(({ _id, requestedBy }) => {
               return (
                  <div key={_id} className="py-2 flex justify-between items-center">
                     <div className="flex justify-center items-center gap-1">
                        <Avatar src={getUserAvatar(requestedBy)} />
                        <span
                           className="text-dark-primary dark:text-light-primary"
                        >
                           {requestedBy.username}
                        </span>
                     </div>

                     <div className="flex justify-center items-center gap-2">
                        <button
                           className="w-7 h-7 bg-red-100 rounded-full hover:font-semibold"
                           onClick={() => deleteRequest(_id)}
                        >
                           <CloseOutlined className="text-red-500 text-[1rem]" />
                        </button>
                        <button
                           className="w-7 h-7 bg-green-100 rounded-full hover:font-semibold"
                           onClick={() => acceptRequest(_id)}
                        >
                           <CheckOutlined className="text-green-500 text-[1rem]" />
                        </button>
                     </div>

                  </div>
               )
            })
         }

         {
            activeTab === 2 &&
            requests?.map(({ _id, requestedTo, createdAt }) => {
               return (
                  <div key={_id} className="py-2 flex justify-between items-center">
                     <div className="flex justify-center items-center gap-1">
                        <Avatar src={getUserAvatar(requestedTo)} />
                        <span
                           className="hidden md:inline text-dark-primary dark:text-light-primary"
                        >
                           {requestedTo.username}
                        </span>
                     </div>
                     <div className="flex justify-center items-center gap-2">
                        <div>{moment(createdAt).fromNow()}</div>
                        <button
                           className="w-7 h-7 bg-red-100 rounded-full hover:font-semibold"
                           onClick={() => deleteRequest(_id)}
                        >
                           <CloseOutlined className="text-red-500 text-[1rem]" />
                        </button>
                     </div>
                  </div>
               )
            })
         }
      </div>
   )
};

export default RequestOverlay;
