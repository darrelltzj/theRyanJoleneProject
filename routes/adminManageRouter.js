const express = require('express')
const router = express.Router()
const adminManageController = require('../controllers/adminManageController')
const passport = require('../config/passport')

router.route('/')
.get(adminManageController.getAdminManage)

module.exports = router
