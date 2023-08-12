const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetTypeSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('assettype', assetTypeSchema);