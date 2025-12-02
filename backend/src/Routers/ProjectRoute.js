import project from '../models/ProjectSchema.js'
import express from 'express'
import User from '../models/UserSchema.js';
import mongoose from 'mongoose'
import Task from '../models/TaskSchema.js';
const router=express.Router();


router.post('/add',async (req,res)=>{
    const newProject=new project(req.body);
    await newProject.save();
    const manager=await User.findById(req.body.managerId);
    
    manager.project.push(newProject._id);
    await manager.save();
    for (let index = 0; index < req.body.team.length; index++) {
        const element = req.body.team[index];
        const emp=await User.findById(element);
        emp.project.push(newProject._id);
        await emp.save();
    }
    res.send({message: 'Project added'});
})

router.get('/getAll',async (req,res)=>{
    const { managerId } = req.query;
    let projects;
    if(managerId && mongoose.Types.ObjectId.isValid(managerId)){
    projects=await project.find({managerId:managerId}).populate('managerId').populate('team').populate({
    path: 'tasks',
    populate: {
      path: 'assignedTo',   // nested population
      model: 'User',        // optional, explicit clarity
    },
  });
    }

    res.send({projects});
});

router.put('/update', async (req, res) => {
    const currentProject = await project.findById(req.body._id);
console.log("projecct to update:",req.body);
    // Convert both arrays to string ids for safe comparison
    const oldTeam = currentProject.team.map(id => id.toString());
    const newTeam = req.body.team ? req.body.team.map(id => id.toString()) : [];

    // Check if team actually changed
    const teamChanged =
        oldTeam.length !== newTeam.length ||
        oldTeam.some(id => !newTeam.includes(id));

    if (teamChanged) {
        // add project to new team members
        for (let memberId of newTeam) {
            if (!oldTeam.includes(memberId)) {
                const member = await User.findById(memberId);
                if (member) {
                    member.project.push(req.body._id);
                    await member.save();
                }
            }
        }

        //remove project from removed team members
        for (let memberId of oldTeam) {
            if (!newTeam.includes(memberId)) {
                const member = await User.findById(memberId);
                if (member) {
                    member.project = member.project.filter(
                        projId => projId.toString() !== req.body._id.toString()
                    );
                    await member.save();
                }
            }
        }

        const tasks = await Task.find({ projectId: req.body._id });

        for (let task of tasks) {
            if (task.assignedTo && !newTeam.includes(task.assignedTo.toString())) {
                // Remove task from user's task list
                const user = await User.findById(task.assignedTo);
                if (user) {
                    user.tasks = user.tasks.filter(
                        tid => tid.toString() !== task._id.toString()
                    );
                    await user.save();
                }
                req.body.tasks = req.body.tasks.filter(
                    tid => tid._id.toString() !== task._id.toString()
                );
                await task.deleteOne();
            }
        }
    }

    const updatedProject = await project.findByIdAndUpdate(
        req.body._id,
        req.body,
        { new: true }
    );

    res.send({ message: 'Project updated' });
});


router.delete('/delete',async (req,res)=>{
    const proj=await project.findById(req.body._id);
    const manager=await User.findById(proj.managerId);
    manager.project=manager.project.filter(projId=>projId.toString()!==req.body._id);
    await manager.save();
    for (let index = 0; index < proj.team.length; index++) {
        const emp=await User.findById(proj.team[index]);
        emp.project=emp.project.filter(projId=>projId.toString()!==req.body._id);
        await emp.save();
    }
    const tasks=await Task.find({projectId:req.body._id});
    for (let index = 0; index < tasks.length; index++) {
            // Remove task from user's tasks array 
            const user = await User.findById(tasks[index].assignedTo);
            if (user) {
                user.tasks = user.tasks.filter(taskId => taskId.toString() !== tasks[index]._id.toString());
                await user.save();
            }
            await tasks[index].deleteOne();
            
        }
    
    await project.findByIdAndDelete(req.body._id);
    res.send({message: 'Project deleted'});
});
export default router;