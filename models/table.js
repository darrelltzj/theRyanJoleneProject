const mongoose = require('mongoose')
// const User = require('../models/user')

var TableSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  capacity: {
    type: Number,
    default: 10
  },
  plannedFor: {
    type: Number,
    default: 0
  },
  reservedFor: {
    type: Number,
    default: 0
  },
  checkedIn: {
    type: Number,
    default: 0
  },
  permanent: {
    type: Boolean,
    default: false
  }
})

// edit user
// call method to update itself
// TableSchema.methods.updateTableVal = function(prevTable, tableId, changedVal) {
//   // find table id
//   //
// }

var Table = mongoose.model('Table', TableSchema)

module.exports = Table
