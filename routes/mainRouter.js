const express = require('express')
const router = express.Router()
const mainController = require('../controllers/mainController')
const passport = require('../config/passport')

router.route('/')
.get(mainController.getMain)

router.route('/signup')
.get(mainController.getSignup)
.post(mainController.postSignup)

router.route('/login')
.get(mainController.getLogin)
.post(passport.authenticate('local', {
  successRedirect: '/preference',
  failureRedirect: '/login'
}))

router.route('/preference')
.get(mainController.getPreference)

router.route('/logout')
.get(mainController.getLogout)

module.exports = router
