const mongoose = require('mongoose')

var TableSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  capacity: {
    type: Number,
    default: 10,
    min: [1, 'Table capacity must be at least 1']
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

var Table = mongoose.model('Table', TableSchema)

module.exports = Table
