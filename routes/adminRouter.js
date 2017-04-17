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
.post(adminController.postAdminEditGuest)

router.route('/table/add')
.get(adminController.getAdminAddTable)
.post(adminController.postAdminAddTable)

router.route('/table/:id')
.get(adminController.getAdminEditTable)
.post(adminController.postAdminEditTable)

router.route('/checkin')
.get(adminController.getAdminCheckIn)

router.route('/checkin/:id')
.get(adminController.getAdminCheckInGuest)
.post(adminController.postAdminCheckInGuest)

module.exports = router
