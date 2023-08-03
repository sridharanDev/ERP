const mongoose = require('mongoose');

const courseSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('Course', courseSchema);