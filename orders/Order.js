const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    bookId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    deliveryDate: {
        type: Date,
        default: Date.now(),
        required: true
    }
});

module.exports = orderSchema;