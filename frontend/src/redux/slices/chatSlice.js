import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   chatList: null,
   selectedChat: null,
   messages: null,
   messagesLoading: false,

   messageText: "",
   sendMessageLoading: false,
   scrollToLastMessage: false,

   page: 1,
   noMessageRemaining: false,
}

const chatSlice = createSlice({
   name: 'chatSlice',
   initialState,
   reducers: {
      setChatList: (state, action) => {
         state.chatList = action.payload;
      },
      setSelectedChat: (state, action) => {
         state.selectedChat = action.payload;
         state.page = 1;
         state.noMessageRemaining = false;
      },
      addChat: (state, action) => {
         const newChat = action.payload;
         if (state.chatList === null) {
            state.chatList = [newChat];
         }
         else {
            state.chatList = [newChat, ...state.chatList];
         }
      },
      updateChat: (state, action) => {
         const updatedChat = action.payload;
         const index = state.chatList.findIndex((chat) => chat._id == updatedChat._id);

         if (index != undefined && index != -1) {
            state.chatList.splice(index, 1);
            state.chatList = [updatedChat, ...state.chatList];
         }
         else {
            const previousChatList = [...state.chatList];
            previousChatList[index] = updatedChat;
            state.chatList = previousChatList;
         }
      },
      replaceChat: (state, action) => {
         const updatedChat = action.payload;
         const index = state.chatList.findIndex((chat) => chat._id == updatedChat._id);

         if (index != undefined && index != -1) {
            state.chatList[index] = updatedChat;
         }
      },
      removeChat: (state, action) => {
         const removedChat = action.payload;
         state.chatList = state.chatList?.filter((chat) => chat?._id != removedChat?._id);

         if (state.selectedChat?._id == removedChat?._id) {
            state.selectedChat = null;
            state.messages = null;
            state.messagesLoading = false;
            state.messageText = "";
            state.sendMessageLoading = false;
            state.scrollToLastMessage = false;
            state.page = 1;
            state.noMessageRemaining = false;
         }
      },
      setMessages: (state, action) => {
         state.messages = action.payload;
      },
      setMessagesLoading: (state, action) => {
         state.messagesLoading = action.payload;
      },
      addNewMessage: (state, action) => {
         const newMessage = action.payload;

         if (state.selectedChat?._id == newMessage?.chat) {
            state.messages = [...state.messages, newMessage];
         }
      },
      addNewMessagesAtTop: (state, action) => {
         const newMessages = action.payload;

         state.messages = [...newMessages, ...state.messages];

      },
      setMessageText: (state, action) => {
         state.messageText = action.payload;
      },
      setSendMessageLoading: (state, action) => {
         state.sendMessageLoading = action.payload;
      },
      setScrollToLastMessage: (state, action) => {
         state.scrollToLastMessage = action.payload;
      },
      setPage: (state, action) => {
         state.page = action.payload;
      },
      setNoMessageRemaining: (state, action) => {
         state.noMessageRemaining = action.payload;
      },
      updateMessage: (state, action) => {
         const updatedMessage = action.payload;
         if (updatedMessage.chat !== state.selectedChat._id) {
            return;
         }

         const index = state.messages.findIndex((msg) => msg._id == updatedMessage._id);
         if (index != undefined && index != -1) {
            state.messages[index] = updatedMessage;
         }

         const chat = state.chatList.find((chat) => chat._id == updatedMessage.chat);

         if (chat) {
            chat.lastMessage.text = updatedMessage.text;
            chat.lastMessage.updatedAt = updatedMessage.updatedAt;
         }
      },

      deleteMessage: (state, action) => {
         const deletedMessage = action.payload;
         if (deletedMessage.chat !== state.selectedChat._id) {
            return;
         }

         state.messages = state.messages.filter((msg) => msg._id != deletedMessage._id);
      }
   }
})

export default chatSlice.reducer;

export const {
   setChatList,
   setSelectedChat,
   addChat,
   updateChat,
   replaceChat,
   removeChat,
   setMessages,
   setMessagesLoading,
   addNewMessage,
   addNewMessagesAtTop,
   setMessageText,
   setSendMessageLoading,
   setScrollToLastMessage,
   setPage,
   setNoMessageRemaining,
   updateMessage,
   deleteMessage,
} = chatSlice.actions;