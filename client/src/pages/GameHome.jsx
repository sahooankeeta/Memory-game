import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate} from 'react-router-dom'
const GameHome = ({socket}) => {
    const navigate=useNavigate()
    const [roomId,setRoomId]=useState()
    const user=useSelector(state=>state.authData)
    const gotoRoom=(roomId)=>{
      if(roomId)
      {
        socket.emit("join_room",{name:user.name,room:roomId,userId:user._id})
      navigate(`/game/${roomId}`)
    }
    }

    // CREATE NEW GAME ROOM
     const handleStart=()=>{
      gotoRoom(''+Date.now())
     }

     // JOIN GAME ROOM
      const handleJoin=()=>{
       gotoRoom(roomId)
      }
  return (
    <div className='flex flex-col gap-2 w-full px-4 md:w-1/2 mx-auto my-4 items-center'>
      <button onClick={handleStart}  className='capitalize px-5 py-2.5 font-semibold rounded-md bg-cyan-600 text-white'>start game</button>
      <div className="font-bold text-yellow-400">OR</div>
      <div className="flex gap-3 items-center">
      <input type='text' placeholder='Enter game code' name="code" onChange={(e)=>setRoomId(e.target.value)}
      className="px-3 py-2 flex-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1  focus:invalid:border-slate-500 focus:invalid:ring-slate-500 disabled:shadow-none"/>
       <button onClick={handleJoin}  className='capitalize px-5 py-2.5 rounded-md font-semibold bg-cyan-600 text-white'>join game</button>
      </div>
    </div>
  )
}

export default GameHome