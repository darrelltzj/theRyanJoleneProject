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
      if (err) {
        console.error(err)
      }
      else {
        res.render('./admin/manage', {
          tablesArr: results[0],
          usersArr: results[1]
        })
      }
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
      if (err) {
        console.error(err)
        req.flash('error', 'Error. Unable to save table.')
        res.redirect('/admin/table/add')
      }
      else {
        res.redirect('/admin')
      }
    })
  },
  getAdminEditTable: function (req, res) {
    Table.findById(req.params.id, (err, table) => {
      if (err) {
        console.error(err)
        req.flash('error', 'Error. Unable to find table.')
        res.redirect('/admin/table/' + req.params.id)
      }
      res.render('./admin/manageEditTable', {
        table: table
      })
    })
  },
  editTable: function (req, res) {
    if (req.body.action === 'update') {
      Table.findOneAndUpdate({
        _id: req.params.id
      }, {
        name: req.body.name,
        capacity: req.body.capacity
      }, function (err, results) {
        if (err) {
          console.error(err)
          req.flash('error', 'Error. Unable to edit table.')
          res.redirect('/admin/table/' + req.params.id)
        }
        else {
          res.redirect('/admin')
        }
      })
    }
  },
  deleteTable: function (req, res) {
    var tableNotSetId
    var usersAffected = []
    var totalHeadCountAllowed = 0
    var totalHeadCountSelected = 0
    var totalCheckedIn = 0

    if (req.body.action === 'remove') {
      async.series([
        function (callback) {
          Table.findOne({name: 'NOT SET'}, function (err, data) {
            if (err) {
              console.error(err)
            }
            else {
              tableNotSetId = data._id
              callback()
            }
          })
        },
        function (callback) {
          // find all users with table
          User.find({
            table: req.params.id
          }, function (err, users) {
            usersAffected = users
            callback()
          })
        },
        function (callback) {
          usersAffected.forEach(function (user) {
            totalHeadCountAllowed += user.headCountAllowed
            totalHeadCountSelected += user.headCountSelected
            totalCheckedIn += user.checkedin
          })
          callback()
        },
        function (callback) {
          Table.findOneAndUpdate({
            _id: tableNotSetId
          },{
            $inc: {
              plannedFor: totalHeadCountAllowed,
              reservedFor: totalHeadCountSelected,
              checkedIn: totalCheckedIn
            }
          }, callback)
        },
        function (callback) {
          //
          User.update({
            table: req.params.id
          }, {
            table: tableNotSetId
          }, {
            multi: true
          }, callback)
        },
        function (callback) {
          Table.findByIdAndRemove({
            _id: req.params.id
          }, callback)
        }
      ], function (err, results) {
        if (err) {
          console.error(err)
          req.flash('error', 'Error. Unable to remove table.')
          res.redirect('/admin/table/' + req.params.id)
        }
        else {
          res.redirect('/admin')
        }
      })
    }
  },
  getAdminAddGuest: function (req, res) {
    Table.find({}, function (err, results) {
      if (err) {
        console.error(err)
        req.flash('error', 'Error. Unable to find tables.')
        res.redirect('/admin')
      }
      else {
        res.render('./admin/manageAddGuest', {
          tablesArr: results
        })
      }
    })
  },
  postAdminAddGuest: function (req, res) {
    var savedGuest
    var totalHeadCount
    async.series([
      function (callback) {
        if (req.body.attending == 'true') {
          totalHeadCount = parseInt(req.body.addGuest) + 1
          callback()
        }
        else if (req.body.attending == 'false') {
          if (req.body.addGuest > 0) {
            req.flash('error', 'Additional Guests must be 0 if not attending.')
            res.redirect('/admin/guest/add')
          }
          else if (req.body.addGuest < 0) {
            req.flash('error', 'Additional Guests cannot be a negative number.')
            res.redirect('/admin/guest/add')
          }
          else {
            totalHeadCount = 0
            callback()
          }
        }
      },
      function (callback) {
        if (!req.body.name || !req.body.email || req.body.headCountAllowed < totalHeadCount || req.body.checkedin > totalHeadCount) {
          req.flash('error', 'Error in input. Please Check.')
          res.redirect('/admin/guest/add')
        }
        else {
          callback()
        }
      },
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
              reservedFor: savedGuest.headCountSelected,
              checkedIn: savedGuest.checkedin
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
      if (err) {
        console.error(err)
        req.flash('error', 'Error. Unable to find data.')
        res.redirect('/admin')
      }
      else {
        res.render('./admin/manageEditGuest', {
          tablesArr: results[0],
          user: results[1]
        })
      }
    })
  },
  editGuest: function (req, res) {
    var totalHeadCount
    var prevTableId
    var prevHeadCountAllowed
    var prevHeadCountSelected
    var prevCheckedIn

    if (req.body.action === 'update') {
      async.series([
        function (callback) {
          if (req.body.attending == 'true') {
            totalHeadCount = parseInt(req.body.addGuest) + 1
            callback()
          }
          else if (req.body.attending == 'false') {
            if (req.body.addGuest > 0) {
              req.flash('error', 'Additional Guests must be 0 if not attending.')
              res.redirect('/admin/guest/' + req.params.id)
            }
            else if (req.body.addGuest < 0) {
              req.flash('error', 'Additional Guests cannot be a negative number.')
              res.redirect('/admin/guest/' + req.params.id)
            }
            else {
              totalHeadCount = 0
              callback()
            }
          }
        },
        function (callback) {
          if (!req.body.name || !req.body.email || req.body.headCountAllowed < totalHeadCount || req.body.checkedin > totalHeadCount) {
            req.flash('error', 'Error in input. Please Check.')
            res.redirect('/admin/guest/' + req.params.id)
          }
          else {
            callback()
          }
        },
        function (callback) {
          User.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
              console.error(err)
              req.flash('error', 'Error. Cannot find user')
              res.redirect('/admin/guest/' + req.params.id)
            }
            else {
              prevTableId = user.table
              prevHeadCountAllowed = user.headCountAllowed
              prevHeadCountSelected = user.headCountSelected
              prevCheckedIn = user.checkedin
              callback()
            }
          })
        },
        function (callback) {
          Table.findOneAndUpdate({
            _id: prevTableId
          }, {
            $inc: {
              plannedFor: -prevHeadCountAllowed,
              reservedFor: -prevHeadCountSelected,
              checkedIn: -prevCheckedIn
            }
          }, function (err, table) {
            if (err) {
              console.error(err)
              req.flash('error', 'Fatal Error. Previous Table does not exist.')
              res.redirect('/admin/guest/' + req.params.id)
            }
            else {
              callback()
            }
          })
        },
        function (callback) {
          User.findOneAndUpdate({
            _id: req.params.id
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
        res.redirect('/admin')
      })
    }
  },
  deleteGuest: function (req, res) {
    var prevTableId
    var prevHeadCountAllowed
    var prevHeadCountSelected
    var prevCheckedIn

    if (req.body.action === 'remove') {
      async.series([
        function (callback) {
          User.findOne({_id: req.params.id}, function (err, user) {
            if (err) {
              console.error(err)
              req.flash('error', 'Error. Cannot find user')
              res.redirect('/admin/guest/' + req.params.id)
            }
            else {
              prevTableId = user.table
              prevHeadCountAllowed = user.headCountAllowed
              prevHeadCountSelected = user.headCountSelected
              prevCheckedIn = user.checkedin
              callback()
            }
          })
        },
        function (callback) {
          Table.findOneAndUpdate({
            _id: prevTableId
          }, {
            $inc: {
              plannedFor: -prevHeadCountAllowed,
              reservedFor: -prevHeadCountSelected,
              checkedIn: -prevCheckedIn
            }
          }, callback)
        },
        function (callback) {
          User.findByIdAndRemove({
            _id: req.params.id
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
      if (err) {
        console.error(err)
        // req.flash('error', 'Error in removing')
        // res.redirect('/admin/guest/' + req.params.id)
      }
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
  putAdminCheckInGuest: function (req, res) {
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
