const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const Like = new Schema({
    userid: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    blogid: {
        type: ObjectId,
        ref: 'blog',
        required: true
    }
});
Like.index({userid:1, blogid: 1}, {unique: true});

module.exports = mongoose.model('like', Like);
