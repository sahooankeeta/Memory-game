import { useState,useEffect } from 'react';
import Confetti from 'react-confetti'
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
import { setCards,setLevel,setReveals,setMatch,clearGame,setPoints, initialPoints } from '../actions/auth';
const Game=({socket})=>{
  const {roomId:room}=useParams()
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {authData:user,cards=[],reveals=[],match=[],users=[],level=3}=useSelector(state=>state)
   
   const [turnIndex,setTurnIndex]=useState(-1)
   const [showConfetti,setShowConfetti]=useState(false)
   const [isGameOver,setIsGameOver]=useState(false)
   const [gameOverText,setGameOverText]=useState()
   const [askRestart,setAskRestart]=useState(false)
   const [copied,setCopied]=useState(false)
   
     const handleClick=(card)=>{
      if(turnIndex!==-1 )
      socket.emit('flip_card',{card,room,name:user.name})
      
     } 
     const handleReveal=(card)=>{
      if(reveals.length<2 && !reveals.includes(card))
      {
        if(reveals.length===0)
        dispatch(setReveals([...reveals,card]))
       else{
         dispatch(setReveals([...reveals,card]))
         setTimeout(()=>{
           let card1=reveals[0].split('-')
           let card2=card.split('-')
           
           if(card1[0]===card2[0])
            {
             
              if(turnIndex>-1)
              socket.emit("update_points",{userId:user._id,room,name:user.name})
               dispatch(setMatch([...match,+card1[1],+card2[1]]))
               if(match.length===(level-1)*2)
                handleGameOver()
            }
              dispatch(setReveals([]))
           
          
         },1000)
       }
       if(turnIndex!==-1)
       {
        if(turnIndex===1)
        {
          socket.emit("switch_turn",{room})
        }else
       setTurnIndex(p=>p+1)
       }
       
      }
     }
     const restart=()=>{
      socket.emit('restart',{room})
      
     }
     const handleGameOver=()=>{
      setIsGameOver(true)
       setShowConfetti(true)
     
      
     }
     const handleExit=()=>{
      socket.emit("leave_room",{name:user.name,room,userId:user._id})
      dispatch(clearGame())
    navigate("/")
     }
     const handlePermission=(value)=>{
      
      socket.emit("permission_response",{room,response:value})
       setAskRestart(false)
     }

 useEffect(()=>{
  if(isGameOver)
  {if(users[0].points>users[1].points)
  setGameOverText(`${(users[0].name).trim()} is the winner`)
 else if(users[0].points<users[1].points)
  setGameOverText(`${(users[1].name).trim()} is the winner`)
 else
  setGameOverText("It's a tie")}
 },[isGameOver,users])
 
 useEffect(() => {
  socket.on("turn",(data)=>{
    
    setTurnIndex(data.turnIndex)
  })
  socket.on('message', (data) => {
    ;
    if(data.cards?.length>0)
    {
     dispatch(setCards(data.cards))
     dispatch(setLevel(data.level))
    }
  });
  socket.on("set_players",(data)=>{
   
    dispatch(initialPoints(data))
  })
 socket.on('flip_card_response',(data)=>{
  
  handleReveal(data.card)
 })
 socket.on('switch_turn_response',(data)=>{
  if(turnIndex===-1)
    setTurnIndex(0)
  else
  setTurnIndex(-1)
 })
 socket.on("update_points_response",(data)=>{
  
  dispatch(setPoints(data))
 })
 socket.on('restart_permission',(data)=>{

  setAskRestart(true)
 })
 socket.on('get_cards_response',(data)=>{
  setIsGameOver(false)
  dispatch(setCards(data.cards))
  dispatch(setLevel(data.level))
  setGameOverText(null)
 })

// Remove event listener on component unmount
  return () => {
    socket.off('message');
    socket.off('flip_card_response');
    socket.off('turn');
    socket.off('set_players');
    socket.off('switch_turn_response');
    socket.off('restart_permission')
    socket.off('get_cards_response')
    socket.off("update_points_response")
  }
}, [socket,reveals,match,turnIndex,askRestart,cards,users,gameOverText]);
  return (
    <div className='px-6'>
     
      {showConfetti &&
      <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={500}
      recycle={false}
      gravity={0.2}
      onConfettiComplete={()=>setShowConfetti(false)}
    />}
    <div className='flex gap-3 justify-end mb-3'>
    
      {askRestart?  <>
        <button className='capitalize px-5 py-2.5 font-semibold rounded-md bg-cyan-600 text-white min-w-[150px]' onClick={()=>handlePermission(true)}>accept</button>
        <button className='capitalize px-5 py-2.5 font-semibold rounded-md bg-cyan-600 text-white min-w-[150px]' onClick={()=>handlePermission(false)}>reject</button>
      </>:<>
      <button onClick={restart} className="capitalize px-5 py-2.5 font-semibold rounded-md bg-cyan-600 text-white min-w-[150px]">restart</button> 
      <button onClick={handleExit} className="capitalize px-5 py-2.5 font-semibold rounded-md bg-cyan-600 text-white min-w-[150px]">exit</button> 
      </>} 
     </div>
    <div className="flex justify-between items-center">
    <div className='flex gap-3 text-xl tracking-wide'>
     {turnIndex>-1 ? <div>
        <div className='text-red-500 font-semibold capitalize'>{users.find(i=>i.userId!==user._id)?.name} - {users.find(i=>i.userId!==user._id)?.points}</div>
        <div className='text-lime-500 font-semibold capitalize'>{users.find(i=>i.userId===user._id)?.name} - {users.find(i=>i.userId===user._id)?.points}</div>
      </div> :
      <div>
      <div className='text-lime-500 font-semibold capitalize'>{users.find(i=>i.userId!==user._id)?.name} - {users.find(i=>i.userId!==user._id)?.points}</div>
      <div className='text-red-500 font-semibold capitalize'>{users.find(i=>i.userId===user._id)?.name} - {users.find(i=>i.userId===user._id)?.points}</div>
    </div> }
     </div>
     <div className='flex gap-2 items-center '>
      <div className='text-slate-200 font-bold tracking-wider '>{'<'} {room} {'/>'}</div>
      <button
      onClick={()=>{
        navigator.clipboard.writeText(room)
        setCopied(true)
        setTimeout(()=>{
          setCopied(false)
        },2000)
      }}
      className="rounded-lg text-white bg-pink-600 py-2 px-4 min-w-[150px]">{copied?'Code copied':'Copy code'}</button>
     </div>
    </div>
    
  
     
      
    {(isGameOver && gameOverText) && <div  class="sentence-case font-extrabold text-transparent zoomIn text-7xl md:text-9xl bg-clip-text bg-gradient-to-r from-purple-400 via-pink-600 to-yellow-400 leading-loose text-center">{gameOverText}</div>}
      <div className='flex flex-wrap gap-3 my-6 justify-center'>
      {cards.map((item,index)=><div key={index} onClick={()=>handleClick(`${item.name}-${index}`)} className={`flip-card ${match.includes(index)?'hide':''} ${(reveals.includes(`${item.name}-${index}`)) ? 'reveal':''}`}>
  <div className="flip-card-inner">
    <div className="flip-card-front">
      <img src="https://i.ibb.co/fXpYxpv/2B.png" alt="2B" style={{width:"100%",height:"100%"}}/>
    </div>
    <div className="flip-card-back">
      <img src={item.image} alt={item.name} style={{width:"100%",height:"100%"}}/>
    </div>
  </div>
</div>)}
      </div>
    </div>
  );
}

export default Game;
