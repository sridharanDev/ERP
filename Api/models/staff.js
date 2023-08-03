const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staff_id:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    father_name:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase: true,
        trim: true,
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
    },
    address:{
        type:String,
        required:true,
    },
    qualification:{
        type:String,
        required:true,
    },
    interview_date:{
        type:String,
        required:true,
    },
    join_date:{
        type:String,
        required:true,
    },
    designation:{
        type:String,
        required:true,
    },
    role:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'StaffRole',
        required:true,
    },
    status:{
        type:String,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model("Staff",staffSchema);