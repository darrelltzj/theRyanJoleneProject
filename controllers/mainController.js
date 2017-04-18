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
  getLogin: function (req, res) {
    res.render('./auth/login')
  },
  getChangePass: function (req, res) {
    res.render('./auth/changePass', {
      flash: req.flash('error')
    })
  },
  postChangePass: function (req, res) {
    User.findOne({email: req.user.email}, function (err, user) {
      if (req.body.newPassword !== req.body.passConfirmation) {
        req.flash('error', 'Passwords do not match.')
        res.redirect('/changepassword')
      }
      else {
        user.password = req.body.newPassword
        user.save(function (err) {
          if (err) {
            req.flash('error', 'Unable to change password. Password must be more than 6 characters.')
            res.redirect('/changepassword')
          }
          else {
            User.findOneAndUpdate({
              _id: req.user._id
            }, {
              haveInit: true
            }, function (err, user) {
              res.redirect('/preference')
            })
          }
        })
      }
    })
  },
  getPreference: function (req, res) {
    console.log('setting preference', req.user)
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
        if (req.body.attending == 'true') {
          totalHeadCount = parseInt(req.body.addGuest) + 1
          headCountDiff = totalHeadCount - req.body.prevHeadCountSelected
          callback()
        } else if (req.body.attending == 'false') {
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
    res.redirect('/login')
  }
}

module.exports = mainController
