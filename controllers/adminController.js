const express = require('express')
const Event = require('../models/event')
const Table = require('../models/table')
const User = require('../models/user')
const passport = require('../config/passport')
const async = require('async')
require('dotenv').config({ silent: true })

const passphrase = process.env.PASSPHRASE

const adminManageController = {
  getAdminManage: function (req, res) {
    var usersWithTable
    async.series([
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
    if (req.body.action === 'update') {
      Table.findOneAndUpdate({
        _id: req.body.id
      }, {
        name: req.body.name,
        capacity: req.body.capacity
      }, function (err, results) {
        if (err) console.error(err)
        console.log(results)
        res.redirect('/admin')
      })
    }
    else if (req.body.action === 'remove') {
      async.parallel([
        function (callback) {
          User.update({
            table: req.body.id
          }, {
            table: null
          }, callback)
        },
        function (callback) {
          Table.findByIdAndRemove({
            _id: req.body.id
          }, callback)
        }
      ], function (err, results) {
        if (err) console.error(err)
        // console.log(results)
        res.redirect('/admin')
      })
    }
  },
  getAdminAddGuest: function (req, res) {
    async.parallel([
      function (callback) {
        Table.find({}, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
      // console.log(results)
      res.render('./admin/manageAddGuest', {
        tablesArr: results[0]
      })
    })
  },
  postAdminAddGuest: function (req, res) {
    var savedGuest
    var totalHeadCount
    if (req.body.attending == 'true') {
      totalHeadCount = parseInt(req.body.addGuest) + 1
    }
    else if (req.body.attending == 'false') {
      totalHeadCount = 0
    }
    if (!req.body.name || !req.body.email || req.body.headCountAllowed < totalHeadCount || req.body.checkedin > totalHeadCount) {
      req.flash('error', 'Error in input. Please Check.')
      res.redirect('/admin/guest/add')
    }
    else {
      async.series([
        function (callback) {
          let newGuest = new User({
            name: req.body.name,
            email: req.body.email,
            admin: req.body.admin,
            attending: req.body.attending,
            table: req.body.table,
            foodPref: req.body.foodPref,
            headCountAllowed: req.body.headCountAllowed,
            headCountSelected: totalHeadCount,
            checkedin: req.body.checkedin,
            password: passphrase
          })
          newGuest.save(function (err, theGuest) {
            if (err || !theGuest) {
              req.flash('error', 'Error in input. User may already exist. Please Check.')
              res.redirect('/admin/guest/add')
            }
            else {
              savedGuest = theGuest
              callback()
            }
          })
        },
        function (callback) {
          if (savedGuest) {
            Table.findOneAndUpdate({
              _id: req.body.table
            }, {
              $inc: {
                plannedFor: savedGuest.headCountAllowed,
                reservedFor: savedGuest.headCountSelected
              }
            }, callback)
          }
          else {
            req.flash('error', 'Error. Unable to update table')
            res.redirect('/admin/guest/add')
          }
        }
      ], function (err, results) {
        if (err || !results) {
          req.flash('error', 'Error in input. Please Check.')
          res.render('/admin/guest/add')
        }
        res.redirect('/admin')
      })
    }
  },
  getAdminEditGuest: function (req, res) {
    async.parallel([
      function (callback) {
        Table.find({}, callback)
      },
      function (callback) {
        User.findById(req.params.id, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
      res.render('./admin/manageEditGuest', {
        tablesArr: results[0],
        user: results[1]
      })
    })
  },
  postAdminEditGuest: function (req, res) {
    var totalHeadCount
    if (req.body.action === 'update') {
      if (req.body.attending == 'true') {
        totalHeadCount = parseInt(req.body.addGuest) + 1
      } else if (req.body.attending == 'false') {
        totalHeadCount = 0
      }
      if (!req.body.name || !req.body.email || req.body.headCountAllowed < totalHeadCount || req.body.checkedin > totalHeadCount) {
        req.flash('error', 'Error in input. Please Check.')
        res.redirect('/admin/guest/' + req.params.id)
      }
      else {
        async.series([
          function (callback) {
            // user find one
            // find original table
            // update table - old values of user
            // update user with req.body
            // update new table
            User.findOneAndUpdate({
              _id: req.body.id
            }, {
              name: req.body.name,
              email: req.body.email,
              admin: req.body.admin,
              attending: req.body.attending,
              table: req.body.table,
              foodPref: req.body.foodPref,
              headCountAllowed: req.body.headCountAllowed,
              headCountSelected: totalHeadCount,
              checkedin: req.body.checkedin
            }, function (err, user) {
              if (err) {
                req.flash('error', 'Error in input. Email may already exist. Please Check.')
                res.redirect('/admin/guest/' + req.params.id)
              }
              else {
                callback()
              }
            })
          },
          function (callback) {
            Table.findOneAndUpdate({
              _id: req.body.prevTable
            }, {
              $inc: {
                plannedFor: -req.body.prevHeadCountAllowed,
                reservedFor: -req.body.prevHeadCountSelected,
                checkedIn: -req.body.prevCheckedIn
              }
            }, callback)
          },
          function (callback) {
            Table.findOneAndUpdate({
              _id: req.body.table
            }, {
              $inc: {
                plannedFor: req.body.headCountAllowed,
                reservedFor: totalHeadCount,
                checkedIn: req.body.checkedin
              }
            }, callback)
          }
        ], function (err, results) {
          if (err) {
            req.flash('error', 'Error in input. Please Check.')
            res.redirect('/admin/guest/' + req.params.id)
          }
          // console.log(results)
          res.redirect('/admin')
        })
      }
    }
    else if (req.body.action === 'remove') {
      // async
      async.parallel([
        function (callback) {
          User.findByIdAndRemove({
            _id: req.body.id
          }, callback)
        },
        function (callback) {
          Table.findOneAndUpdate({
            _id: req.body.prevTable
          }, {
            $inc: {
              plannedFor: -req.body.prevHeadCountAllowed,
              reservedFor: -req.body.prevHeadCountSelected,
              checkedIn: -req.body.prevCheckedIn
            }
          }, callback)
        }
      ], function (err, results) {
        if (err) {
          req.flash('error', 'Error in removing')
          res.redirect('/admin/guest/' + req.params.id)
        }
        res.redirect('/admin')
      })
    }
  },
  getAdminCheckIn: function (req, res) {
    User.find({}).populate('table').exec( function (err, usersArr) {
      if (err) console.error(err)
      res.render('./admin/checkin', {
        usersArr: usersArr
      })
    })
  },
  getAdminCheckInGuest: function (req, res) {
    User.findById(req.params.id).populate('table').exec( function (err, user) {
      if (err) console.error(err)
      res.render('./admin/checkinGuest', {
        user: user
      })
    })
  },
  postAdminCheckInGuest: function (req, res) {
    async.parallel([
      function (callback) {
        User.findOneAndUpdate({
          _id: req.params.id
        }, {
          checkedin: req.body.checkedin
        }, callback)
      },
      function (callback) {
        Table.findOneAndUpdate({
          _id: req.body.guestTableId
        }, {
          $inc: {
            checkedIn: req.body.checkedin - req.body.prevCheckedIn
          }
        }, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
      res.redirect('/admin/checkin')
    })
  }
}

module.exports = adminManageController
