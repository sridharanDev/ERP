const mongoose = require('mongoose');

const staffRoleSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    salery: {
        type: Number,
        required: true,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('StaffRole', staffRoleSchema);