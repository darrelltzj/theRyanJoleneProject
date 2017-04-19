const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')

router.route('/')
.get(adminController.getAdminManage)

router.route('/guest/add')
.get(adminController.getAdminAddGuest)
.post(adminController.postAdminAddGuest)

router.route('/guest/:id')
.get(adminController.getAdminEditGuest)
.put(adminController.editGuest)
.delete(adminController.deleteGuest)

router.route('/table/add')
.get(adminController.getAdminAddTable)
.post(adminController.postAdminAddTable)

router.route('/table/:id')
.get(adminController.getAdminEditTable)
.put(adminController.postAdminEditTable)
.delete(adminController.deleteTable)

router.route('/checkin')
.get(adminController.getAdminCheckIn)

router.route('/checkin/:id')
.get(adminController.getAdminCheckInGuest)
.put(adminController.putAdminCheckInGuest)

module.exports = router
