const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema  = new mongoose.Schema({
    type: {
        type: Schema.Types.ObjectId,
        ref: 'expensetype',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('expense', expenseSchema);