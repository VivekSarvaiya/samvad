import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   myProfile: null,
   userId: null,
   modalVisibility: false,
   modalChild: "",
   recievedRequests: null,
   sentRequests: null,
   selectedRequestId: null,
   mainLoading: false,

   showChatFriendDrawer: false,
}

const appConfigSlice = createSlice({
   name: 'appConfigSlice',
   initialState,
   reducers: {
      setMyProfile: (state, action) => {
         state.myProfile = action.payload;
      },
      setUserId: (state, action) => {
         state.userId = action.payload;
      },
      setModalVisibility: (state, action) => {
         state.modalVisibility = action.payload;
      },
      setModalChild: (state, action) => {
         state.modalChild = action.payload;
      },
      setRecievedRequests: (state, action) => {
         state.recievedRequests = action.payload;
      },
      setSentRequests: (state, action) => {
         state.sentRequests = action.payload;
      },
      addNewSentRequest: (state, action) => {
         state.sentRequests = [action.payload, ...state.sentRequests]
      },
      addNewRecievedRequest: (state, action) => {
         state.recievedRequests = [action.payload, ...state.recievedRequests]
      },
      setSelectedRequestId: (state, action) => {
         state.selectedRequestId = action.payload;
      },
      removeRecievedRequests: (state, action) => {
         const requestId = action.payload;
         if (state.recievedRequests) {
            state.recievedRequests = state.recievedRequests.filter((request) => request._id != requestId);
         }
      },
      removeSentRequests: (state, action) => {
         const requestId = action.payload;
         if (state.sentRequests) {
            state.sentRequests = state.sentRequests.filter((request) => request._id != requestId);
         }
      },
      setMainLoading: (state, action) => {
         state.mainLoading = action.payload;
      },
      openChatFriendDrawer: (state) => {
         state.showChatFriendDrawer = true;
      },
      closeChatFriendDrawer: (state) => {
         state.showChatFriendDrawer = false;
      },
   }
})

export default appConfigSlice.reducer;

export const {
   setMyProfile,
   setUserId,
   setModalVisibility,
   setModalChild,
   setRecievedRequests,
   setSentRequests,
   addNewSentRequest,
   addNewRecievedRequest,
   setSelectedRequestId,
   removeRecievedRequests,
   removeSentRequests,
   setMainLoading,
   openChatFriendDrawer,
   closeChatFriendDrawer,
} = appConfigSlice.actions;