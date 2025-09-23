import mongoose from 'mongoose'
const ProjectSchema=new mongoose.Schema(
    {
        id: {
        type: Number,
        unique: true,
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
        // You could also reference a manager from a User model here.
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'On Hold', 'Canceled']
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