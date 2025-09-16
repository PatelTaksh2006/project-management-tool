const mongoose = require('mongoose')
const UserSchema=new mongoose.Schema({
    Id:{type:Number , required:true},
    Name:{type:String,required:true},
    Email:{type:Email,required:true},
    isManager:{type:Boolean,required:true},
    role:{type:String,required:true},
    department:{type:String,required:true},
    joiningDate :{type:Date,required:true},
    phone:{type:string , required:true},
    address:{type:string ,required:true},
    project:[
        {
            ObjectId:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
    ]
}
);
const User = mongoose.model("User",UserSchema);