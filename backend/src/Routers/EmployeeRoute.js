import user from '../models/UserSchema.js'
import express from 'express'
const router=express.Router();


router.post('/add',async (req,res)=>{
    const newEmp=new user(req.body);
    await newEmp.save();
    res.send('Employee added');
});

export default router;