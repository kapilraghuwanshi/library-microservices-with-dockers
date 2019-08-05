const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: function getDefaultAddress() { return 'India'; },
        required: false
    }
});

module.exports = customerSchema;