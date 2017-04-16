const express = require('express')
const User = require('../models/user')
const passport = require('../config/passport')

const adminCheckInController = {
  getAdminCheckIn: function (req, res) {
    User.find({}, function (err, usersArr) {
      if (err) console.error(err)
      res.render('./admin/checkin', {
        usersArr: usersArr
      })
    })
  }
}

module.exports = adminCheckInController
