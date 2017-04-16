var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

var UserSchema = new mongoose.Schema({
  name:  {
    type: String,
    required: true,
    minlength: [1, 'Name must be between 1 and 99 characters'],
    maxlength: [99, 'Name must be between 1 and 99 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true ,
    minlength: [6, 'Password must be between 6 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters'],
  },
  admin: {
    type: Boolean,
    default: false
  },
  attending: {
    type: Boolean,
    default: false
  },
  table: {
    type: String,
    default: 'NOT SET'
  },
  group: {
    type: String,
    default: 'NOT SET'
  },
  foodPref: {
    type: String,
    default: 'NO INDICATION'
  },
  headCountAllowed: {
    type: Number,
    default: 2
  },
  headCountSelected: {
    type: Number,
    default: 1
  },
  checkedin: {
    type: Number,
    default: 0
  }
})

UserSchema.pre('save', function(next) {
   var user = this
   if (!user.isModified('password')) return next()
   var hash = bcrypt.hashSync(user.password, 10)
   user.password = hash
   next()
})

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
}

var User = mongoose.model('User', UserSchema)

module.exports = User
