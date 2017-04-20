// ---Sheetsu attempt---
const User = require('../models/user')
const async = require('async')

const sheetsu = require('sheetsu-node')
const client = sheetsu({
  address: '22d5da24f31b'
})

require('dotenv').config({ silent: true })

const sheetsuController = {
  getSheetsu: function (req, res) {
    var sheetsuData = []
    async.series([
      function (callback) {
        client.read().then(function (data) {
          sheetsuData = JSON.parse(data)
          callback()
        }, function (err) {
          console.log(err)
          res.redirect('/admin')
        })
      },
      function (callback) {
        // UPDATE sheetsuData WITH TABLE ID
        // sheetsuData.forEach(function (guest) {
        //   Table.find({name:guest.table}, function (err, data) {
        //     if (err) {
        //       console.error(err)
        //       res.redirect('/admin')
        //     }
        //     else {
        //       guest.table = data[0]._id
        //       console.log(sheetsuData)
        //     }
        //   })
        // })
        callback()
      },
      function (callback) {
        User.find({}, callback).populate('table').exec()
      }
    ], function (err, results) {
      if (err) {
        console.error(err)
        res.redirect('/admin')
      }
      else {
        // console.log(JSON.parse(sheetsuData))
        // console.log(results[2]);
        res.render('./admin/sheetsu', {
          sheetsuArr: sheetsuData,
          usersArr: results[2]
        })
      }
    })
  }
}

module.exports = sheetsuController
