const mongoose = require('mongoose')

let participantSchema = new mongoose.Schema({
  
})

let Participant = mongoose.model('Participant', participantSchema)

module.exports = Participant
