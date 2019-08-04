const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.ObjectId;

var bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    version: {
        type: Number,
        default: function getDefaultVersion() { return 1; },
        required: false
    },
    publisherId: {
        type: ObjectId,
        required: false
    },
});

module.exports = bookSchema;