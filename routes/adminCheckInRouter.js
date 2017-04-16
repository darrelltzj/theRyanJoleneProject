const express = require('express')
const router = express.Router()
const adminCheckInController = require('../controllers/adminCheckInController')
const passport = require('../config/passport')

router.route('/')
.get(adminCheckInController.getAdminCheckIn)

module.exports = router
