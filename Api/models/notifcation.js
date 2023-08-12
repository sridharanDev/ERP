const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema  = new mongoose.Schema({
    type: {
        type: String,
        enum:['Task','Attendance','Leave','Message','Other'],
        default:'Other',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Staff' 
    },
    admin: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admins'
    },
    viewed: {
        type: Boolean,
        default:false,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('Notification', notificationSchema);