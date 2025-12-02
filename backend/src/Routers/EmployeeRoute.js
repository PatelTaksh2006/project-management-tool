import user from '../models/UserSchema.js'
import express from 'express'
import auth from '../middleware/auth.js';
const router=express.Router();


// router.post('/add',async (req,res)=>{
//     const newEmp=new user(req.body);
//     await newEmp.save();
//     res.send('Employee added');
// });



router.get('/getAll',auth, async (req,res)=>{
    const emps=await user.find({isManager:false});
    res.send({emps});
});

export default router;