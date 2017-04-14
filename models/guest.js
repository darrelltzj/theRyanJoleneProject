var mongoose = require('mongoose')

var GuestSchema = new mongoose.Schema({
  userIC: String,
  foodPreference: String,
  table: String,
  group: String,
  checkedIn: Boolean
})

var Guest = mongoose.model('Guest', GuestSchema)

module.exports = Guest
