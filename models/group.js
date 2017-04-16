const mongoose = require('mongoose')
// const User = require('../models/user')

var GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  guests: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
})

var Group = mongoose.model('Group', GroupSchema)

module.exports = Group
