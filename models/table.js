var mongoose = require('mongoose')

var TableSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  occupants: Number
})

var Table = mongoose.model('Table', TableSchema)

module.exports = Table
