import { useState,useEffect } from 'react';
import { Auth,Game,Home,GameHome } from './pages';
import './App.css';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import openSocket from 'socket.io-client';

const socket = openSocket(process.env.REACT_APP_API, { 
  transports : ['websocket'],
});

const App=()=>{
  const user=useSelector(state=>state.authData)
  return (
    <div className="bg-slate-800 min-h-screen ">
      <ToastContainer/>
     <BrowserRouter >
      <Routes>
        <Route path="/auth" element={user?<Navigate to="/"/>:<Auth/>}/>
        <Route path="/" element={user? <Home/>:<Navigate to="/auth"/>}>
        <Route path='/game/:roomId' element={<Game socket={socket}/>}/>
        <Route path='/' element={<GameHome socket={socket}/>}/>
        </Route>
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
