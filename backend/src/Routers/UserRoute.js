import User from '../models/UserSchema.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router=express.Router();

router.post('/signup',async (req,res)=>{
    const newUser=new User(req.body);
    newUser.Password=await bcrypt.hash(newUser.Password,10);
    await newUser.save();
    res.send('user added');
});

router.post('/login',async (req,res)=>{
    const {Email,Password}=req.body;
    const user=await User.findOne({Email}).populate('tasks').populate('project');
    if(user && await bcrypt.compare(Password,user.Password)){
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        
        const {Password,...userWithoutPassword}=user._doc;
        res.send({
            user:userWithoutPassword,
            token:token
        });
    }else{
        res.status(401).send('Invalid credentials');
    }
});



export default router;