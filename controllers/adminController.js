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
  },
  getAdminManageGuest: function (req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) throw err
      // console.log(user)
      res.render('./admin/manageguest', {
        user: user
      })
    })
  },
  postAdminManage: function (req, res) {
    // console.log(req.body, req.params)
    if (req.body.action == 'update') {
      User.findOneAndUpdate({
        _id: req.body.id
      }, {
        name: req.body.name,
        email: req.body.email,
        admin: req.body.admin,
        attending: req.body.attending,
        table: req.body.table,
        group: req.body.group,
        foodPref: req.body.foodPref,
        headCountAllowed: req.body.headCountAllowed,
        headCountSelected: req.body.headCountSelected
      }, function (err, data) {
        if (err) console.error(err)
        res.redirect('/admin/manage')
      })
    }
    else if (req.body.action == 'remove') {
      User.findByIdAndRemove(req.body.id, function (err, user) {
        if (err) console.error(err)
        res.redirect('/admin/manage')
      })
    }
  },
  getAdminManageAddGuest: function (req, res) {
    res.render('./admin/manageAddGuest')
  },
  getAdminCheckIn: function (req, res) {
    User.find({}, function (err, usersArr) {
      if (err) console.error(err)
      res.render('./admin/checkin', {
        usersArr: usersArr
      })
    })
  }
}

module.exports = adminManageController
