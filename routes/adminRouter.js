const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const passport = require('../config/passport')

router.route('/manage')
.get(adminController.getAdminManage)
.post(adminController.postAdminManage)

router.route('/manage/add')
.get(adminController.getAdminManageAddGuest)

router.route('/manage/:id')
.get(adminController.getAdminManageGuest)

router.route('/checkin')
.get(adminController.getAdminCheckIn)

module.exports = router
