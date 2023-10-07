const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

const port = process.env.PORT || 8000;
const app = express();
const http = require('http').createServer(app);
// const { Server } = require('socket.io'); 
const {gameServer}=require("./socket")
const DB = process.env.DB.replace("<password>", process.env.PASSWORD);

mongoose.connect(DB).then((con) => {
  console.log("connection made to database");
})
.catch(err => console.log(err.message));

gameServer(http)
// let level=3
// function generateLevel(){
//   return Math.floor(Math.random()*3)+3
// }
app.use(express.json())
app.use(cors());
// const socketIO = new Server(http, {
//  cors:{
//   origin:process.env.CLIENT_URL, 
//  },
 
// },

// );
// const shuffle=(arr)=>{
//   return arr.sort((a,b)=>Math.random()-0.5)
// }
// const getCards=(level)=>{
//   let t=shuffle(items).slice(0,level)
//   let cards=(shuffle([...t,...t]))
//   return cards
// }
// let allUsers=[]
// socketIO.on('connection', (socket) => {
//   console.log(`user just connected!`);
  
//   socket.on('join_room', (data) => {
//     const { name, room,userId } = data; 
    
//     socket.join(room); 
//     if(allUsers.findIndex(i=>i.userId === userId)==-1)
//     allUsers.push({userId,name,room})
    
//     let roomUsers=allUsers.filter(i=>i.room==room)
    
//     socketIO.sockets.in(room).emit('set_players', roomUsers);
    
//     let cards=[]
//    const clientSize=socketIO.sockets.adapter.rooms.get(room)?.size || 0
//    if(clientSize==1)
//     socketIO.to(room).emit('turn',{
//     message:`${name} first turn`,
//     turnIndex:0
//   })
//    if(clientSize==2)
//    {
//     level=generateLevel()
//      cards=getCards(level)
    
//    }
    
//     socket.to(room).emit('message', {
//       message: `${name} has joined the room`,
//       timestamp:new Date(),
//       cards,
//       level
//     });
    
//     socket.emit('message', {
//       message: `Welcome ${name}`,
//       timestamp:new Date(),
//       cards
//     });
//   });
//   socket.on('leave_room',(data)=>{
//     const {room,name,userId}=data
//     socket.leave(room)
//     allUsers=allUsers.filter(i=>i.userId!==userId)
    
//     socket.to(room).emit('message', {
//       message: `${name} has left the room`,
//       timestamp:new Date(),
      
//     });
//   })
//   socket.on('flip_card',(data)=>{
//     const {name,card,room}=data
//     socketIO.sockets.in(room).emit('flip_card_response', {
//       message: `${name} has flipped card`,
//       card
//     });
//   })
//   socket.on('restart',(data)=>{
    
//     socket.to(data.room).emit('restart_permission', {
//       message: `restart ?`,
//     });
  
//   })
//   socket.on("permission_response",(data)=>{
   
//     const {room,response}=data
//     if(response)
//     {level=generateLevel()
//     socketIO.sockets.in(room).emit('get_cards_response', {
//       message: `new cards`,
//       cards:getCards(level),
//       level
//     });
//   }
//   })
//   socket.on('switch_turn',(data)=>{
//     const {room}=data
//     socketIO.sockets.in(room).emit('switch_turn_response');
//   })
//   socket.on('update_points',(data)=>{
//     const {room,userId,name}=data
//     socketIO.sockets.in(room).emit('update_points_response',{userId,name});
//   })
//   socket.on('disconnect', () => {
//     console.log('🔥: A user disconnected');
//   });
// });

app.use("/", require("./routes"));
app.all("*",(req, res) => {
    res.status(404).json({
        success:false,
        message :  `Cannot find ${req.originalUrl} on this server`
    })
}) 

 
http.listen(port, function (err) {
    if (err) {
      console.log("error on running port");
    }
    console.log(`server running on ${port}`);
});