const mongoose = require('mongoose');

const staudentSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum:["male","female"],
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
    },
    passed_out_year: {
        type: Number,
    },
    current_status: {
        type: String,
        enum:["studying","working","job seeking"],
        required: true,
    },
    institute_or_company: {
        type: String,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Course',
        required: true,
    }],
    note: {
        type: String,
    },
    paid: {
        type: Number,
        default:0,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Staff',
    },
    status: {
        type: String,
        enum:["call back","intrested","not intrested","not answer","converted"],
        default:"call back"
    },
    join_date: {
        type: String,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('Student', staudentSchema);