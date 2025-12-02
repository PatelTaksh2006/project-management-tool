import mongoose from "mongoose";
const TaskSchema=mongoose.Schema(
    {
        name: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // References the 'User' model
    },
    status: {
        type: String,
        required: true,
        enum: ["To Do", "In Progress", "Completed"]
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"]
    },
    dueDate: {
        type: Date
    },
    files: [{
        
    name: String,
    url: String
    }], // Array of embedded file documents
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // References the 'Project' model
        required: true
    }
    }
);

const Task=mongoose.model("Task",TaskSchema);

export default Task;