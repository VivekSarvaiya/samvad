import { io } from 'socket.io-client';
import { SOCKET_URL } from '../constants';

export let socket;

export const connectSocket = async (token) => {
   const options = {
      'force new connection': true,
      reconnectionAttempt: 'Infinity',
      timeout: 10000,
      transports: ['websocket'],
      query: {
         token: token,
      },
   };
   // socket = io(import.meta.env.VITE_APP_SOCKET_URL, options);
   socket = io(SOCKET_URL, options);
};