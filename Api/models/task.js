const mongoose = require('mongoose');

const taskSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Staff',
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Project',
    },
    status: {
        type: String,
        enum:["pending","inProgres","completed"],
        default:"pending",
        required: true,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('Task', taskSchema);