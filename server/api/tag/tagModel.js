const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Tag = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('tag', Tag);
