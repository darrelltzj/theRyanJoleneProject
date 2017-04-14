var mongoose = require('mongoose')

var EventSchema = new mongoose.Schema({
  date: String,
  location: String,
  tables: [],
  guestsPending: [],
  guestsAttending: [],
  guestsDeclined: []
})

var Event = mongoose.model('Event', EventSchema)

module.exports = Event
