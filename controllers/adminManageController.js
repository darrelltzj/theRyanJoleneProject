const express = require('express')
const User = require('../models/user')
const passport = require('../config/passport')

const adminManageController = {
  getAdminManage: function (req, res) {
    User.find({}, function (err, usersArr) {
      if (err) console.error(err)
      res.render('./admin/manage', {
        usersArr: usersArr
      })
    })
  }
}

module.exports = adminManageController
