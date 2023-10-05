import { useState,useEffect } from 'react';
import {Navbar} from "../components"
import Confetti from 'react-confetti'
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCards,setReveals,setMatch,clearGame,setPoints, initialPoints } from '../actions/auth';
const Game=({socket})=>{
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {authData:user,cards=[],reveals=[],match=[],users=[]}=useSelector(state=>state)
  console.log(users)
   const types=['C','H','D','S']
   //console.log(shuffle(types))
   const [turnIndex,setTurnIndex]=useState(-1)
   const [showConfetti,setShowConfetti]=useState(false)
   const [isGameOver,setIsGameOver]=useState(false)
   const [gameOverText,setGameOverText]=useState()
  // const [cards,setCards]=useState([])
   //const [reveals,setReveals]=useState([])
   //const [match,setMatch]=useState([])
   const [askRestart,setAskRestart]=useState(false)
   const level=3
     const handleClick=(card)=>{
      if(turnIndex!==-1 )
      socket.emit('flip_card',{card,room:'test',name:user.name})
      
     } 
     const handleReveal=(card)=>{
      // console.log("card reveals",reveals.length)
      // setReveals(p=>[...p,card])
      if(reveals.length<2 && !reveals.includes(card))
      {
        if(reveals.length===0)
        dispatch(setReveals([...reveals,card]))
       else{
         dispatch(setReveals([...reveals,card]))
         setTimeout(()=>{
           let card1=reveals[0].split('-')
           let card2=card.split('-')
           console.log(card1,card2)
           if(card1[0]===card2[0])
            {
              console.log("MATCH")
              if(turnIndex>-1)
              socket.emit("update_points",{userId:user._id,room:'test',name:user.name})
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
          socket.emit("switch_turn",{room:'test'})
        }else
       setTurnIndex(p=>p+1)
       }
       
      }
     }
     const restart=()=>{
      console.log('restart clicked')
      socket.emit('restart',{room:'test'})
      // let t=shuffle(items).slice(0,level)
      // setCards(shuffle([...t,...t]))
      
     }
     const handleGameOver=()=>{
      setIsGameOver(true)
       setShowConfetti(true)
     
      
     }
     const handleExit=()=>{
      socket.emit("leave_room",{name:user.name,room:'test',userId:user._id})
      dispatch(clearGame())
    navigate("/")
     }
     const handlePermission=(value)=>{
      console.log("permission",value)
      socket.emit("permission_response",{room:'test',response:value})
       setAskRestart(false)
     }
  // const variety=[2,3,4,5,6,7,8,9,10,'K','Q','A','J']
  //  let cards=[]
  // for(let i=0;i<types.length;i++)
  // {
  //   for(let j=0;j<variety.length;j++){
  //     cards.push({name:variety[j]+types[i],"image":""})
  //   }
  // }
  console.log(turnIndex)
  // console.log(cards)
 useEffect(()=>{
  if(isGameOver)
  {if(users[0].points>users[1].points)
  setGameOverText(`${users[0].name} is the winner`)
 else if(users[0].points<users[1].points)
  setGameOverText(`${users[1].name} is the winner`)
 else
  setGameOverText("It's a tie")}
 },[isGameOver,users])
 
 useEffect(() => {
  socket.on("turn",(data)=>{
    console.log(data)
    setTurnIndex(data.turnIndex)
  })
  socket.on('message', (data) => {
    console.log(data);
    if(data.cards?.length>0)
     dispatch(setCards(data.cards))
  });
  socket.on("set_players",(data)=>{
    dispatch(initialPoints(data))
  })
 socket.on('flip_card_response',(data)=>{
  console.log(data)
  handleReveal(data.card)
 })
 socket.on('switch_turn_response',(data)=>{
  if(turnIndex===-1)
    setTurnIndex(0)
  else
  setTurnIndex(-1)
 })
 socket.on("update_points_response",(data)=>{
  console.log(data)
      
  dispatch(setPoints(data))
 })
 socket.on('restart_permission',(data)=>{
  console.log(data)
  setAskRestart(true)
 })
 socket.on('get_cards_response',(data)=>{
  console.log(data)
  dispatch(setCards(data.cards))
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
}, [socket,reveals,match,turnIndex,askRestart,cards,users]);
  return (
    <div>
      <Navbar/>
      {showConfetti &&
      <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={500}
      recycle={false}
      gravity={0.2}
      onConfettiComplete={()=>setShowConfetti(false)}
    />}
      <button onClick={restart} className="btn">restart</button> 
      {askRestart && <>
        <button className='btn' onClick={()=>handlePermission(true)}>accept</button>
        <button className='btn' onClick={()=>handlePermission(false)}>reject</button>
      </>} 
      <button onClick={handleExit} className="btn">exit</button> 
      {turnIndex>-1 ? <div>
        <div className='text-red-600 font-semibold capitalize'>{users.find(i=>i.userId!==user._id)?.name}-{users.find(i=>i.userId!==user._id)?.points}</div>
        <div className='text-green-600 font-semibold capitalize'>{users.find(i=>i.userId===user._id)?.name}-{users.find(i=>i.userId===user._id)?.points}</div>
      </div> :
      <div>
      <div className='text-green-600 font-semibold capitalize'>{users.find(i=>i.userId!==user._id)?.name}-{users.find(i=>i.userId!==user._id)?.points}</div>
      <div className='text-red-600 font-semibold capitalize'>{users.find(i=>i.userId===user._id)?.name}-{users.find(i=>i.userId===user._id)?.points}</div>
    </div> }
    {gameOverText && <div  class="font-extrabold text-transparent zoomIn text-9xl bg-clip-text bg-gradient-to-r from-purple-400 via-pink-600 to-yellow-400 leading-loose text-center">{gameOverText}</div>}
      <div className='grid'>
      {cards.map((item,index)=><div key={index} onClick={()=>handleClick(`${item.name}-${index}`)} className={`flip-card ${match.includes(index)?'hide':''} ${(reveals.includes(`${item.name}-${index}`)) ? 'reveal':''}`}>
  <div className="flip-card-inner">
    <div className="flip-card-front">
      <img src="https://i.ibb.co/fXpYxpv/2B.png" alt="2B" style={{width:"100%",height:"100%"}}/>
    </div>
    <div className="flip-card-back">
      <h1>{item.name}</h1>
    </div>
  </div>
</div>)}
      </div>
    </div>
  );
}

export default Game;
