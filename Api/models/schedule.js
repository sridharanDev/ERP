const mongoose = require('mongoose');
const { Schema } = mongoose;

const scheduleSchema  = new mongoose.Schema({
    in_time: {
        type: String,
        required: true,
    },
    out_time: {
        type: String,
        required: true,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('schedule', scheduleSchema);