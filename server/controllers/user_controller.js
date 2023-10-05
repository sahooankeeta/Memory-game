const bcrypt=require( "bcryptjs");
const jwt =require("jsonwebtoken");
const User=require("../models/user")

const jwt_secret='test'

module.exports.signIn=async(req,res)=>{
    try{
        const { email, password } = req.body;
        const oldUser = await User.findOne({ email });
        if (!oldUser) return res.status(404).json({success:false, message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect) return res.status(400).json({success:false, message: "Invalid credentials" });
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, jwt_secret, { expiresIn: "7d" });
        res.status(200).json({success:true,data:{ user: oldUser, token },message:'user logged in successfully'});
    }catch(e){
        console.log(e.message)
        return res.status(500).json({success:false, message:e.message})
    }
}
module.exports.signUp=async(req,res)=>{
    try{
        const {name,email,password,confirm_password}=req.body
        const existingUser=await User.findOne({email})
        if(existingUser)
         return res.status(400).json({success:false,message:'User with this email already exists'})
        if(password!==confirm_password)
          return res.status(400).json({success:false,message:"Passwords do not match"})
       const hashedPassword = await bcrypt.hash(password, 12);
       const result = await User.create({ name,email,password: hashedPassword });
       const token = jwt.sign( { email: result.email, id: result._id }, jwt_secret, { expiresIn: "7d" } );
       res.status(201).json({success:true,data:{ user:result, token },message:'New user created successfully'});
    }catch(e){
        console.log(e.message)
        return res.status(500).json({success:false, message:e.message})
    }
}
module.exports.resetPassword=async(req,res)=>{
    try{
     const {email,password,confirm_password}=req.body
     const existingUser=await User.findOne({email})
     if(!existingUser)
      return res.status(400).json({success:false,message:'User not found'})
     if(password!==confirm_password)
       return res.status(400).json({success:false,message:"Passwords do not match"})
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.findByIdAndUpdate(existingUser._id,{ password: hashedPassword });
    const token = jwt.sign( { email: result.email, id: result._id }, jwt_secret, { expiresIn: "7d" } );
    res.status(201).json({success:true,data:{ user:result, token },message:'Password updated successfully'});
    }catch(e){
        console.log(e)
        res.status(500).json({success:false,message:e.message})
    }
}