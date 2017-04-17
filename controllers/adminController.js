const express = require('express')
const Event = require('../models/event')
const Table = require('../models/table')
const Group = require('../models/group')
const User = require('../models/user')
const passport = require('../config/passport')
const async = require('async')

var randomString = function (len) {
    var theRandomString = ''
    var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < len; i++)
        theRandomString += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length))
    return theRandomString
}

const adminManageController = {
  getAdminManage: function (req, res) {
    async.parallel([
      function (callback) {
        Table.find({}, callback)
      },
      function (callback) {
        User.find({}, callback).populate('table').exec()
      }
    ], function (err, results) {
      if (err) console.error(err)
      // console.log(results)
      res.render('./admin/manage', {
        tablesArr: results[0],
        usersArr: results[1]
      })
    })
  },
  getAdminEditGuest: function (req, res) {
    User.findById(req.params.id, (err, user) => {
      if (err) throw err
      // console.log('user: ',user)
      res.render('./admin/manageEditGuest', {
        user: user
      })
    })
  },
  postAdminEditGuest: function (req, res) {
    // console.log('form: ', req.body, 'id: ', req.params)
    // async.parallel([
    //   function (callback) {
    //     User.find({}, callback)
    //   }
    // ], function (err, results) {
    //   if (err) console.error(err)
    //   res.render('./admin/manage', {
    //   })
    // })
    if (req.body.action == 'update') {
      // async
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
        res.redirect('/admin')
      })
    }
    else if (req.body.action == 'remove') {
      // async
      User.findByIdAndRemove(req.body.id, function (err, user) {
        if (err) console.error(err)
        res.redirect('/admin')
      })
    }
  },
  getAdminAddGuest: function (req, res) {
    async.parallel([
      function (callback) {
        Table.find({}, callback)
      },
      function (callback) {
        Group.find({}, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
      // console.log(results)
      res.render('./admin/manageAddGuest', {
        tablesArr: results[0],
        groupsArr: results[1]
      })
    })
  },
  postAdminAddGuest: function (req, res) {
    var savedGuest
    let newGuest = new User({
      name: req.body.name,
      email: req.body.email,
      admin: req.body.admin,
      attending: req.body.attending,
      table: req.body.table,
      group: req.body.group,
      foodPref: req.body.foodPref,
      headCountAllowed: req.body.headCountAllowed,
      headCountSelected: req.body.headCountSelected,
      password: randomString(6)
    })
    async.series([
      function (callback) {
        newGuest.save(function (err, theGuest) {
          // flash
          if (err) console.error(err)
          savedGuest = theGuest
          callback()
        })
      },
      function (callback) {
        Table.findOneAndUpdate({
          _id: req.body.table
        }, {
          $addToSet: {
            reservedFor: savedGuest._id
          }
        }, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
      res.redirect('/admin')
    })
  },
  getAdminAddTable: function (req, res) {
    res.render('./admin/manageAddTable')
  },
  postAdminAddTable: function (req, res) {
    let newTable = new Table({
      name: req.body.name,
      capacity: req.body.capacity
    })
    newTable.save(function (err, savedTable) {
      if (err) console.error(err)
      res.redirect('/admin')
    })
  },
  getAdminEditTable: function (req, res) {
    Table.findById(req.params.id, (err, table) => {
      if (err) console.error(err)
      res.render('./admin/manageEditTable', {
        table: table
      })
    })
  },
  postAdminEditTable: function (req, res) {
    console.log(req.body)
    async.parallel([
      function (callback) {
        Table.findOneAndUpdate({
          _id: req.body.id
        }, {
          name: req.body.name,
          capacity: req.body.capacity
        }, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
      console.log(results)
      res.redirect('/admin')
    })
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
