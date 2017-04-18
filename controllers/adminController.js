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
    var usersWithTable
    async.series([
      // function (callback) {
      //   Table.find({}, function (err, tablesArray) {
      //     tablesArray.forEach(function (table) {
      //       Table.findOneAndUpdate({
      //         _id: table._id
      //       }, {
      //         plannedFor: 0,
      //         reservedFor: 0,
      //         checkedIn: 0
      //       }, function (err, data) {
      //       })
      //     })
      //     callback()
      //   })
      // },
      // function (callback) {
      //   User.find({}, function (err, usersArray) {
      //     usersWithTable = usersArray.map(function (user) {
      //       if (user.table) {
      //         return user
      //       }
      //     })
      //     callback()
      //   })
      // },
      // function (callback) {
      //   // console.log(usersWithTable)
      //   usersWithTable.forEach(function (user) {
      //     // console.log(user)
      //     Table.findOneAndUpdate({
      //       _id: user.table
      //     }, {
      //       $inc: {
      //         plannedFor: user.headCountAllowed,
      //         reservedFor: user.headCountSelected,
      //         checkedIn: user.checkedin
      //       }
      //     }, function (err, data) {
      //       console.log('updated', data)
      //     })
      //   })
      //   callback()
      // },
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
          $inc: {
            plannedFor: savedGuest.headCountAllowed,
            reservedFor: savedGuest.headCountSelected
          }
        }, callback)
      }
    ], function (err, results) {
      if (err) console.error(err)
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
      async.series([
        function (callback) {
          if (req.body.attending == 'true') {
            totalHeadCount = parseInt(req.body.addGuest) + 1
            callback()
          } else if (req.body.attending == 'false') {
            totalHeadCount = 0
            callback()
          }
        },
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
            group: req.body.group,
            foodPref: req.body.foodPref,
            headCountAllowed: req.body.headCountAllowed,
            headCountSelected: totalHeadCount,
            checkedin: req.body.checkedin
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
        if (err) console.error(err)
        // console.log(results)
        res.redirect('/admin')
      })
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
        if (err) console.error(err)
        res.redirect('/admin')
      })
      // User.findByIdAndRemove(req.body.id, function (err, user) {
      //   if (err) console.error(err)
      //   res.redirect('/admin')
      // })
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
