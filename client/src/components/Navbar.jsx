import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../actions/auth'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
  return (
    <div className="p-8 sticky top-0 z-10 w-full px-6 py-4 pr-12 flex justify-between items-center border-b-2 mb-4">
        <button 
        onClick={()=>dispatch(logout(navigate))}
        className="rounded-lg text-white bg-pink-600 py-2 px-4">logout</button>
    </div>
  )
}

export default Navbar