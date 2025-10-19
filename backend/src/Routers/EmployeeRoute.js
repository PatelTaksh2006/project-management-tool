import user from '../models/UserSchema.js'
import express from 'express'
const router=express.Router();


router.post('/add',async (req,res)=>{
    const newEmp=new user(req.body);
    await newEmp.save();
    res.send('Employee added');
});



router.get('/getAll',async (req,res)=>{
    const emps=await user.find({isManager:false});
    res.send({emps});
});

export default router;