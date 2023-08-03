const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Adminrole',
        required:true
    },

},{
    timestamps:true,
});

module.exports = mongoose.model("Admins",adminSchema);