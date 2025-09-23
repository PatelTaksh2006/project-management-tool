import mongoose from 'mongoose';
// import Project from ProjectSchema;
const UserSchema=new mongoose.Schema({
    Id:{type:Number , required:true},
    Name:{type:String,required:true},
    Email:{type:String,required:true},
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
}
);
const User = mongoose.model("User",UserSchema);
export default User;