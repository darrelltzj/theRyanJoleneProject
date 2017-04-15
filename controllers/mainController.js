const express = require('express')
const User = require('../models/user')
const passport = require('../config/passport')

const mainController = {
  getMain: function (req, res) {
    res.render('./home')
  },
  getSignup: function (req, res) {
    res.render('./auth/signup')
  },
  postSignup: function (req, res) {
    User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    }, function (err, createdUser) {
      if (err) {
        res.redirect('/signup')
      } else {
        passport.authenticate('local', {
          successRedirect: '/preference'
        })(req, res)
      }
    })
  },
  getLogin: function (req, res) {
    res.render('./auth/login')
  },
  getPreference: function (req, res) {
    console.log(req.user.name, res.locals)
    var name = req.user.name
    res.render('./participant/preference', {
      name: name
    })
  },
  getLogout: function (req, res) {
    req.logout()
    res.redirect('/')
  }
}

module.exports = mainController
