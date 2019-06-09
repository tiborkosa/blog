const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Comment = new Schema({
    userid: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    comment:{
        type:String,
        required: true
    },
    blogid: {
        type: ObjectId,
        ref: 'blog',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('comment', Comment);
