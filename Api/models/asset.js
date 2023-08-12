const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetSchema  = new mongoose.Schema({
    type: {
        type: Schema.Types.ObjectId,
        ref: 'assettype',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    asset_id: {
        type: String,
    },
    to: {
        type: String,
    },
    note: {
        type: String,
    },
    status: {
        type: String,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model('asset', assetSchema);