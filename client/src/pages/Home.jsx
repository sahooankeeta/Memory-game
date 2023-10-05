import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components'
const Home = ({socket}) => {
  const navigate=useNavigate()
  const user=useSelector(state=>state.authData)
    const handleStart=()=>{

    }
    const handleJoin=()=>{
    let room='test'
    socket.emit("join_room",{name:user.name,room,userId:user._id})
    navigate("/game")
    }
  return (
    <div>
    <Navbar/>
    <div className='flex gap-2'>
       <button className='bg-cyan-600 text-white'>start game</button>
       <button onClick={handleJoin}  className='bg-cyan-600 text-white'>join game</button>
    </div>
    </div>
  )
}

export default Home