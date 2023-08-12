const mongoose = require('mongoose');
const { Schema } = mongoose;

const leaveApplicationSchema  = new mongoose.Schema({
    from_date: {
        type: Date,
        required: true,
    },
    to_date: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    staff: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Staff',
        required: true,
    },
    status: {
        type: String,
        enum:['pending','rejected','approved'],
        default:'pending'
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('leaveapplication', leaveApplicationSchema);