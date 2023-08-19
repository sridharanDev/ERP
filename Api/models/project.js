const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    client_name:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    platform:{
        type:String,
        required:true,
    },
    project_name:{
        type:String,
        required:true,
    },
    reference:{
        type:String,
    },
    note:{
        type:String,
    },
    start_date:{
        type:String,
    },
    end_date:{
        type:String,
    },
    call_back_date:{
        type:String,
    },
    staffs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff'}],
    status: { type: String, 
        enum: ['pipeline','call back','upcomming','ongoing','inprogress','completed'],
        default:'pipeline', 
        required: true 
    },
},{
    timestamps:true,
});


module.exports = mongoose.model('Project', projectSchema);
