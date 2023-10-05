import { io,Server } from 'socket.io-client';

const URL = process.env.REACT_APP_URL;

export const socket = io(URL,{
    
    cors: {
        origin: process.env.REACT_APP_URL
      }
  });
  socket.listener(4000)