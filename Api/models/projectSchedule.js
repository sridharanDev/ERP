const mongoose = require('mongoose');

const projectScheduleSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Project',
    },
    date:{
        type:Date,
        required:true,
    },
    time:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});

module.exports = mongoose.model('ProjectSchedule', projectScheduleSchema);