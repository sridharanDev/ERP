const mongoose = require('mongoose');

const invoiceSchema  = new mongoose.Schema({
    refrenece: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    type: {
        type: String,
        required: true,
    },
    invoice_no: {
        type: String,
        required: true,
        unique:true,
    },
    date: {
        type: String,
        required: true,
    },
    customer_name: {
        type: String,
        required: true,
    },
    customer_email: {
        type: String,
    },
    customer_mobile: {
        type: String,
    },
    tax: {
        type: Number,
    },
    discount_percent: {
        type: Number,
    },
    pay_type: {
        type: String,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
    },
    remider_date: {
        type: String,
    },
    items: [{
        name: {
          type: String,
          required: true,
        },
        desc: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
    }],
},{
    timestamps:true,
});

module.exports = mongoose.model('Invoice', invoiceSchema);