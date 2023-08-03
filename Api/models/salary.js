const mongoose = require('mongoose');

const courseSchema  = new mongoose.Schema({
    staff_id: {
        type: String, 
        required: true,
    },
    working_days: {
        type: Number,
        required: true,
    },
    salary_date: {
        type: String,
        required: true,
    },
    credited_date: {
        type: String,
        required: true,
    },
    actual_salary: {
        type: Number,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('Salary', courseSchema);