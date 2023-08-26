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
        required: true,
    },
    note: {
        type: String,
    },
    payment_type: {
        type: String,
        required: true,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('expense', expenseSchema);