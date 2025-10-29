import mongoose from 'mongoose';
// import Project from ProjectSchema;
const UserSchema=new mongoose.Schema({
    EmpId:{type:String,required:true,unique:true},
    Name:{type:String,required:true},
    Email:{type:String,required:true,unique:true},
    Password:{type:String,required:true},
    isManager:{type:Boolean,required:true},
    role:{type:String,required:true},
    department:{type:String,required:true},
    joiningDate :{type:Date,required:true},
    phone:{type:String , required:true},
    address:{type:String ,required:true},
    project:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
    ]
    ,
    tasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task"
        }
    ]
}
);
const User = mongoose.model("User",UserSchema);
export default User;