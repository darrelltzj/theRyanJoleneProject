const mongoose = require('mongoose')
// const User = require('../models/user')

var TableSchema = new mongoose.Schema({
  name: {
    type: String
  },
  capacity: {
    type: Number,
    default: 10
  },
  guests: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
})

var Table = mongoose.model('Table', TableSchema)

module.exports = Table
