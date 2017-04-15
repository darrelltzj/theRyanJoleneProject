const express = require('express')
const User = require('../models/user')
const passport = require('../config/passport')

const mainController = {
  getMain: function (req, res) {
    res.render('./home')
  },
  getSignup: function (req, res) {
    res.render('./auth/signup', {
      flash: req.flash('error')
    })
  },
  postSignup: function (req, res) {
    let user = new User({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    })
    user.save(function (err, createdUser) {
      if (err) {
        req.flash('error', 'Unable to create user account')
        res.redirect('/signup')
      } else {
        passport.authenticate('local', {
          successRedirect: '/preference',
          successFlash: 'Account created and logged in'
        })(req, res)
      }
    })
  },
  getLogin: function (req, res) {
    res.render('./auth/login')
  },
  getPreference: function (req, res) {
    // console.log(req.user.name, res.locals)
    res.render('./participant/preference')
  },
  postPreference: function (req, res) {
    User.findOneAndUpdate({
      _id: req.user._id
    }, {
      attending: req.body.attending,
      foodPref: req.body.foodPref,
      addGuest: req.body.addGuest
    }, function (err, theUser) {
      if (err) console.error(err)
      // console.log(theUser, req.body, req.user)
      console.log(res.locals.currentUser)
      res.redirect('/')
    })
  },
  getLogout: function (req, res) {
    req.logout()
    req.flash('success', 'You have logged out')
    res.redirect('/')
  }
}

module.exports = mainController
