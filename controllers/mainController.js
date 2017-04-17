const express = require('express')
const Table = require('../models/table')
const User = require('../models/user')
const passport = require('../config/passport')
const async = require('async')

const mainController = {
  getMain: function (req, res) {
    // console.log('user', req.user)
    res.render('./home')
  },
  getSignup: function (req, res) {
    res.render('./auth/signup', {
      flash: req.flash('error')
    })
  },
  postSignup: function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
      user.password = req.body.password
      user.save(function (err) {
        if (err) {
          req.flash('error', 'Unable to create user account')
          res.redirect('/signup')
        }
        else {
          passport.authenticate('local', {
            successRedirect: '/preference',
            successFlash: 'Account created and logged in'
          })(req, res)
        }
      })
    })

    // ---IF GUESTS DO NOT HAVE TO BE ON THE LIST BEFORE REGISTERING---
    // let user = new User({
    //   email: req.body.email,
    //   name: req.body.name,
    //   password: req.body.password
    // })
    // user.save(function (err, createdUser) {
    //   if (err) {
    //     req.flash('error', 'Unable to create user account')
    //     res.redirect('/signup')
    //   } else {
    //     passport.authenticate('local', {
    //       successRedirect: '/preference',
    //       successFlash: 'Account created and logged in'
    //     })(req, res)
    //   }
    // })

  },
  getLogin: function (req, res) {
    res.render('./auth/login')
  },
  getPreference: function (req, res) {
    // console.log(req.user.name, res.locals)
    User.findById(req.user._id, function (err, user) {
      if (err) console.error(err)
      res.render('./participant/preference', {
        user: user
      })
    })
  },
  postPreference: function (req, res) {
    // console.log('body', req.body)
    // console.log('user', req.user)
    var totalHeadCount
    var headCountDiff
    async.series([
      function (callback) {
        if (req.body.attending) {
          totalHeadCount = parseInt(req.body.addGuest) + 1
          headCountDiff = totalHeadCount - req.body.prevHeadCountSelected
          callback()
        } else {
          totalHeadCount = 0
          headCountDiff = totalHeadCount - req.body.prevHeadCountSelected
          callback()
        }
      },
      function (callback) {
        User.findOneAndUpdate({
          _id: req.user._id
        }, {
          attending: req.body.attending,
          foodPref: req.body.foodPref,
          headCountSelected: totalHeadCount
        }, callback)
      },
      function (callback) {
        Table.findOneAndUpdate({
          _id: req.user.table
        }, {
          $inc: {
            reservedFor: headCountDiff
          }
        }, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
      // console.log('theUser', results)
      // console.log(res.locals.currentUser)
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
