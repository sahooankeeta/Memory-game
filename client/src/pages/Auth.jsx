import React from 'react'
import {AuthForm} from "../components"
import authBg from "../assets/auth-bg.svg"
const Auth = () => {
  return (
    <div className='w-full h-screen auth-bg flex gap-6 justify-center items-center bg-slate-900 '>
       <AuthForm/>
     <div className="w-0 md:w-1/2 h-full">
      <img className='h-full w-full object-contain' src={authBg} alt=""/>
     </div>
        
    </div>
  )
}

export default Auth