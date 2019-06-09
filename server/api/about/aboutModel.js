const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const About = new Schema({  
  user: {
    type: ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  about: {
  	type: String,
  	default: 'Not completed.'
  },
  image: {
    type:String,
    default: 'sample.jpg'
  },
  publish_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('about', About);
