import project from '../models/ProjectSchema.js'
import express from 'express'
const router=express.Router();


router.post('/add',async (req,res)=>{
    const newProject=new project(req.body);
    await newProject.save();
    res.send('Employee added');
})

export default router;