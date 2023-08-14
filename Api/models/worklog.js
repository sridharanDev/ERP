const mongoose = require('mongoose');

const worklogSchema  = new mongoose.Schema({
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
    }
},{
    timestamps:true,
});

module.exports = mongoose.model('Worklog', worklogSchema);