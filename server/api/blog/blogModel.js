const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const blogBody = new Schema({
  type: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const Blog = new Schema({
  author: {
  	type: ObjectId,
  	ref: 'user',
  	required: true
  },
  title: {
    type: String, 
    default: 'New Post',
    unique: [ true, 'This title already exists!'],
    min: [ 4, 'Title is way too short!'],
    max: [ 32, "Title is too long!"]
  },
  desc:{
    type: String,
    required: [true, 'Description must be present for the main page!'],
    min: [10, 'Description is too short!'],
    max: [100, 'Description is too long!']
  },
  body: {
  	type: [blogBody],
  	required: [true, 'Blog post needs to contain something!']
  },
  categories:[{
    type: String,
    required: [true, 'Select a category for easy search!']
  }],
  tags:[{
    type: String,
    required: [true, 'Add a tag for better visibility!']
  }],
  create_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
    type: Date
  },
  image: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  isLiked:{
    type: Boolean,
    default: false
  }
});

//Blog.index({ title: "text"});
module.exports = mongoose.model('blog', Blog);
