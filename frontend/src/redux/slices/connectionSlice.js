import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {

   friends: null
}

export const addFriend = createAsyncThunk(
   'connectionSlice/addFriend',
   async (chat, { getState, dispatch }) => {
      const state = getState();
      const userId = state.appConfig.userId;
      // Assuming friend is an object and you want to add userId to it
      const friend = chat.members.find((member) => member._id != userId);
      return friend
   }
);

const connectionSlice = createSlice({
   name: 'connectionSlice',
   initialState,
   reducers: {
      setFriends: (state, action) => {
         state.friends = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(addFriend.fulfilled, (state, action) => {
         if (!state.friends) {
            state.friends = [action.payload];
         }
         else {
            state.friends = [...state.friends, action.payload];
         }
      });
   }
})

export default connectionSlice.reducer;

export const {
   setFriends,
} = connectionSlice.actions;