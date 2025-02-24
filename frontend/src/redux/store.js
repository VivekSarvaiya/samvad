import { configureStore } from '@reduxjs/toolkit'
import appConfigReducer from './slices/appConfigSlice'
import chatReducer from './slices/chatSlice'
import connectionReducer from './slices/connectionSlice'

export default configureStore({
   reducer: {
      appConfigReducer,
      chatReducer,
      connectionReducer
   }
})