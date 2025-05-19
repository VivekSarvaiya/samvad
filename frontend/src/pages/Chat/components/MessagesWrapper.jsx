import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { onGetPaginatedMessages } from "../services";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessagesAtTop, setNoMessageRemaining, setPage, setScrollToLastMessage } from "../../../redux/slices/chatSlice";

const MessagesWrapper = ({ messages, userId, selectedChat }) => {

   const { scrollToLastMessage, page, noMessageRemaining } = useSelector(state => state.chatReducer);

   const dispatch = useDispatch();

   const [isLoading, setIsLoading] = useState(false);
   const containerRef = useRef(null);
   const messageEndRef = useRef(null);

   const loadMoreMessages = async (page) => {
      setIsLoading(true);

      const response = await onGetPaginatedMessages(selectedChat._id, page);

      if (response.success) {
         dispatch(addNewMessagesAtTop(response.data.data.messages))
         dispatch(setNoMessageRemaining(response.data.data.noMessagesRemaining))
      }
      else {
         toast.error(response.message);
      }

      setIsLoading(false);
   };

   useEffect(() => {
      // Scroll event listener
      if (!containerRef.current) return;

      const handleScroll = () => {
         const container = containerRef.current;
         if (container?.scrollTop === 0 && !isLoading && !noMessageRemaining) {
            dispatch(setPage(page + 1));
         }
      };

      const container = containerRef.current;
      container?.addEventListener('scroll', handleScroll);

      return () => {
         const container = containerRef.current;
         container?.removeEventListener('scroll', handleScroll);
      };
   }, []); // Dependency on items and isLoading

   useEffect(() => {
      if (page > 1) {
         loadMoreMessages(page);
      }
   }, [page])

   useEffect(() => {
      if (scrollToLastMessage) {
         messageEndRef.current?.scrollIntoView({
            behavior: "smooth",
         })

         dispatch(setScrollToLastMessage(false))
      }
   }, [scrollToLastMessage])

   return (
      <div className="flex-1 overflow-auto py-4 px-2" id="container" ref={containerRef}>

         {
            (!messages || !messages?.length) &&
            <div className="w-full h-full grid place-items-center text-light-primary text-sm sm:text-xl">
               No messages
            </div>
         }

         {
            messages && messages?.length > 0 &&
            messages?.map((message, i) => {
               return (
                  <Message key={i} message={message} userId={userId} />
               )
            })
         }

         <div ref={messageEndRef}></div>

      </div>
   )
};

export default MessagesWrapper;
