const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseTypeSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('expensetype', expenseTypeSchema);