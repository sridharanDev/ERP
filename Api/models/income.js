const mongoose = require('mongoose');
const { Schema } = mongoose;

const incomeSchema  = new mongoose.Schema({
    entityType: {
        type: String,
        enum: ['Project', 'Course', 'Intern','Rent'],
        required: true,
    },
    entity: {
        type: Schema.Types.ObjectId,
        refPath: 'entityType',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default:0,
    },
    note: {
        type: String,
    },
    date:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});

module.exports = mongoose.model('Income', incomeSchema);