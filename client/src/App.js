import { useState,useEffect } from 'react';
import { Auth,Game,Home } from './pages';
import './App.css';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import openSocket from 'socket.io-client';
const URL = process.env.REACT_APP_ENV=== 'production' ? undefined :process.env.REACT_APP_API
const socket = openSocket(process.env.REACT_APP_API, { 
  transports : ['websocket'],
});

const App=()=>{
  const user=useSelector(state=>state.authData)
  return (
    <div className="bg-slate-800 min-h-screen px-6">
      <ToastContainer/>
     <BrowserRouter >
      <Routes>
        <Route path="/auth" element={user?<Navigate to="/"/>:<Auth/>}/>
        <Route path="/" element={user? <Home socket={socket}/>:<Navigate to="/auth"/>}/>
        <Route path='/game' element={<Game socket={socket}/>}/>
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
