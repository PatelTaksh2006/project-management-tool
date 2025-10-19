import mongoose from 'mongoose'
const ProjectSchema=new mongoose.Schema(
    {
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
        // You could also reference a manager from a User model here.
    },
    Name: {
        type: String,
        required: true
    },
    StartDate: {
        type: Date
    },
    EndDate: {
        type: Date
    },
    Status: {
        type: String,
        enum: ['Active', 'Completed', 'Pending']
    },
    client: {
        type: String
    },
    description: {
        type: String
    },
    stakeholders: [String],
    budget: {
        type: Number
    },
    budgetUsed: {
        type: Number
    },
    // Reference to the TeamMember model for the project team
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Reference to the Task model for all project tasks
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}
);

const Project=mongoose.model("Project",ProjectSchema);
export default Project;