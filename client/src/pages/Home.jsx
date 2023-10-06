import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,Outlet } from 'react-router-dom'
import { Navbar } from '../components'
const Home = () => {

  return (
    <div>
    <Navbar/>
    <Outlet/>
    
    </div>
  )
}

export default Home