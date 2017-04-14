const express = require('express')
const router = express.Router()
const mainController = require('../controllers/mainController')
const passport = require('../config/passport')

router.route('/')
.get(mainController.getMain)
// .post(mainController.signupPage)

router.route('/signup')
.get(mainController.getSignup)
.post(mainController.postSignup)

router.route('/preference')
.get(mainController.getPreference)

module.exports = router
