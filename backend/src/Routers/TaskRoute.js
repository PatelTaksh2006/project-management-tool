import express from 'express'
import Task from '../models/TaskSchema.js'
import Project from '../models/ProjectSchema.js'
import User from '../models/UserSchema.js'
import mongoose from 'mongoose'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
                if(diffDays<0 && element.status!=='Completed'){
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
        if (!req.body.dueDate) {
                req.body.priority = 'Low';
            } else {
                        let todayDate=new Date();

                const due = new Date(req.body.dueDate);
                const msPerDay = 1000 * 60 * 60 * 24;
                const utcDue = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
                const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
                const diffDays = Math.floor((utcDue - utcToday) / msPerDay); // days until due
                
                if (diffDays <= 3) {
                    req.body.priority = 'High';
                } else if (diffDays <= 10) {
                    req.body.priority = 'Medium';
                } else {
                    req.body.priority = 'Low';
                }
            }
        const updatedTask = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });
        if(tempTask.assignedTo.toString()!==req.body.assignedTo){
            // Remove task from old user's tasks array
            if (tempTask.assignedTo && mongoose.Types.ObjectId.isValid(tempTask.assignedTo.toString())) {
                const oldUser = await User.findById(tempTask.assignedTo.toString());
                    if (oldUser) {
                    oldUser.tasks = oldUser.tasks.filter(taskId => taskId.toString() !== tempTask._id.toString());
                    await oldUser.save();
                }
            }

            const newUser = await User.findById(req.body.assignedTo);
            if (newUser) {
                newUser.tasks.push(tempTask._id);
                await newUser.save();
            }
        }
        console.log(`Updated Task: ${updatedTask}`);
        let oldFiles=tempTask.files;
        let updatedFiles=updatedTask.files;
        let filesTodelete=oldFiles.filter(file => !updatedFiles.some(newFile => file.url === newFile.url));
        let flagForEnonet=false;
        const uploadsSiblingDir = path.join(__dirname, '..', '..', '..', 'upload_Documents');
        for (const filepath of filesTodelete) {
      const fullPath = path.join(uploadsSiblingDir, filepath.name);
      try {
        await fs.unlink(fullPath);
        console.log('Deleted:', fullPath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          flagForEnonet = true;
          console.log('File already deleted:', fullPath);
        } else {
          console.error(`Error deleting file ${fullPath}:`, err);
        }
      }
    }
        
        //for due date and priority update
        let flagForDueDate=false;
            if (!updatedTask.dueDate) {
                updatedTask.priority = 'Low';
            } else {
                        let todayDate=new Date();

                const due = new Date(updatedTask.dueDate);
                const msPerDay = 1000 * 60 * 60 * 24;
                const utcDue = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
                const utcToday = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
                const diffDays = Math.floor((utcDue - utcToday) / msPerDay); // days until due
                if(diffDays<0 && updatedTask.status!=='Completed'){
                    flagForDueDate=true;
                }
                if (diffDays <= 3) {
                    updatedTask.priority = 'High';
                } else if (diffDays <= 10) {
                    updatedTask.priority = 'Medium';
                } else {
                    updatedTask.priority = 'Low';
                }
            }
            updatedTask._doc.isOverdue = flagForDueDate;
            res.send({ message: 'Task updated', task: updatedTask, flagForEnonet });
        } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to update task' });
    }
});

router.delete('/delete', async (req, res) => {
    const deleteId=req.body.id;
    const deleteTask=await Task.findByIdAndDelete(deleteId);
    const projectId=deleteTask.projectId;
    if(projectId && mongoose.Types.ObjectId.isValid(projectId.toString())) {
        const project=await Project.findById(projectId);
        if (project) {
            project.tasks=project.tasks.filter(taskId=>taskId.toString()!==deleteId);
            await project.save();
        }
    }
    const userId=deleteTask.assignedTo;
    if (userId && mongoose.Types.ObjectId.isValid(userId.toString())) {
        const user = await User.findById(userId.toString());
        if (user) {
            user.tasks = user.tasks.filter(taskId => taskId.toString() !== deleteId);
            await user.save();
        }
    }
    let filesTodelete=deleteTask.files;
    const uploadsSiblingDir = path.join(__dirname,'..', '..', '..', 'upload_Documents');
    for (const filepath of filesTodelete) {

        const fullPath = path.join(uploadsSiblingDir, filepath.name);
      try {
        await fs.unlink(fullPath);
        console.log('Deleted:', fullPath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File already deleted:', fullPath);
        } else {
          console.error(`Error deleting file ${fullPath}:`, err);
        }
      }
    }
    res.send({message:"Task Deleted"});

});

router.get('/getByEmployee/:empId',async (req,res)=>{
    const tasks=await Task.find({assignedTo:req.params.empId}).populate('projectId');
    res.json({tasks});
})
export default router;
