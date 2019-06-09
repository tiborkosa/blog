const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

const bcrypt = require('bcrypt');
 
const User = new Schema({
  first_name: {
  	type: String,
    min: 2,
    max: 16
  },
  last_name: {
    type: String,
    min: 2,
    max: 16
  },
  age: {
    type: Number
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "Invalid email"]
  },
  username: {
    type: String,
    min: 2,
    max: 16
  },
  image: {
    type: String,
    default: "some.jpeg"
  },
  create_date: {
    type: Date,
    default: Date.now()
  },
  password: {
    type: String
  },
  logCount: {
    type: Number
  },
  secretCode: {
    type: String
  },
  secreteCodeExp: {
    type: Date
  }
});

User.pre('save', function(next) {
  if( !this.isModified('password')) return next();

  this.password = this.encryptPassword( this.password);
  next();
  
});


User.methods = {
  authenticate: function(plainTextPwd) {
    return bcrypt.compareSync(plainTextPwd, this.password);
  },
  encryptPassword: function(plainTextPwd){
    if(!plainTextPwd){
      return ''
    } else {
      let salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPwd, salt);
    }
  }
}

module.exports = mongoose.model('user', User);
