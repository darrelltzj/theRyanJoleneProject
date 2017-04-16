const mongoose = require('mongoose')
// const User = require('../models/user')

var EventSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Ryan and Jolene'
  },
  description: {
    type: String,
    default: '1 January 2018'
  },
  capacity: {
    type: Number,
    default: 200
  },
  tables: {
    type: mongoose.Schema.ObjectId,
    ref: 'Table'
  },
  guests: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
})

var Event = mongoose.model('Event', EventSchema)

module.exports = Event
