import express from 'express'
import Task from '../models/TaskSchema.js'
import Project from '../models/ProjectSchema.js'
import User from '../models/UserSchema.js'
import mongoose from 'mongoose'
import fs from 'fs'
const router = express.Router();

// Add a new task and attach it to the project (and user if assigned)
router.post('/add', async (req, res) => {
    console.log("task to add=======================\n"+req.body);
    try {
        const newTask = new Task(req.body);
                // normalize and update dueDate & priority based on days difference
                if (!newTask.dueDate) {
                    newTask.priority = 'Low';
                } else {
                    const due = new Date(newTask.dueDate);
                    let todayDate = new Date();
                    newTask.dueDate = due;
                    const msPerDay = 1000 * 60 * 60 * 24;
                    const utcDue = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
                    const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
                    const diffDays = Math.floor((utcDue - utcToday) / msPerDay);

                    if (diffDays <= 3) {
                        newTask.priority = 'High';
                    } else if (diffDays <= 10) {
                        newTask.priority = 'Medium';
                    } else {
                        newTask.priority = 'Low';
                    }
                }
            
        await newTask.save();
            
        // push task id into project's tasks array
        const project = await Project.findById(req.body.projectId);
        if (project) {
            project.tasks.push(newTask._id);
            await project.save();
        }

        // if assignedTo provided, you may want to attach reference to user (optional)
                if (req.body.assignedTo && mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
            const user = await User.findById(req.body.assignedTo);
            if (user) {
                // optionally you could push task id to a user.tasks array if schema has one
                // For now just log the assignment
                user.tasks.push(newTask._id);
                await user.save();
            }
        }

        res.send({ message: 'Task added', task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to add task' });
    }
});

// Get all tasks for a project or all tasks
router.get('/getAll', async (req, res) => {
    try {
        const { projectId } = req.query;
        let tasks;
        if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
            tasks = await Task.find({ projectId }).populate('assignedTo').populate('projectId');
        } else {
            tasks = await Task.find().populate('assignedTo').populate('projectId');
        }
        let todayDate=new Date();
        for (let index = 0; index < tasks.length; index++) {
            const element = tasks[index];
            // if (element.dueDate < todayDate) {
            //     element.status = 'overdue';
            // }

            let priority=element.dueDate - todayDate;
            let flagForDueDate=false;
            if (!element.dueDate) {
                element.priority = 'Low';
            } else {
                const due = new Date(element.dueDate);
                const msPerDay = 1000 * 60 * 60 * 24;
                const utcDue = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
                const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
                const diffDays = Math.floor((utcDue - utcToday) / msPerDay); // days until due
                if(diffDays<0){
                    flagForDueDate=true;
                }
                if (diffDays <= 3) {
                    element.priority = 'High';
                } else if (diffDays <= 10) {
                    element.priority = 'Medium';
                } else {
                    element.priority = 'Low';
                }
            }
element._doc.isOverdue = flagForDueDate;
        }
        res.send({ tasks});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch tasks' });
    }
});

// Update task
router.put('/update', async (req, res) => {
    try {
        const tempTask=await Task.findById(req.body._id);
        const updatedTask = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });
        if(tempTask.assignedTo.toString()!==req.body.assignedTo._id){
            // Remove task from old user's tasks array
            if (tempTask.assignedTo && mongoose.Types.ObjectId.isValid(tempTask.assignedTo.toString())) {
                const oldUser = await User.findById(tempTask.assignedTo.toString());
                    if (oldUser) {
                    oldUser.tasks = oldUser.tasks.filter(taskId => taskId.toString() !== tempTask._id.toString());
                    await oldUser.save();
                }
            }

            const newUser = await User.findById(req.body.assignedTo._id);
            if (newUser) {
                newUser.tasks.push(tempTask._id);
                await newUser.save();
            }
        }
        console.log(`Updated Task: ${updatedTask}`);
        let oldFiles=tempTask.files;
        let updatedFiles=updatedTask.files;
        let filesTodelete=oldFiles.filter(file => !updatedFiles.some(newFile => file.url === newFile.url));
        filesTodelete.forEach(filepath => {
            const fullPath=`C:\\Users\\taksh\\Documents\\projects\\SEM5\\AT\\project-management-tool\\`+filepath.url;
            fs.unlink(fullPath,(err)=>{
                if(err){
                    console.error(`Error deleting file ${fullPath}:`, err);
                }
            });
        });
        
        res.send({ message: 'Task updated', task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to update task' });
    }
});

router.delete('/delete', async (req, res) => {
    const deleteId=req.body.id;
    await Task.findByIdAndDelete(deleteId);
    // console.log(deleteTask);
    res.send({message:"Task Deleted"});

});

router.get('/getByEmployee/:empId',async (req,res)=>{
    const tasks=await Task.find({assignedTo:req.params.empId}).populate('projectId');
    res.json({tasks});
})
export default router;
