const express = require('express')
const router = express.Router()
const mainController = require('../controllers/mainController')
const passport = require('../config/passport')
const isLoggedIn = require('../middleware/isLoggedIn')
const isLoggedOut = require('../middleware/isLoggedOut')
const haveInit = require('../middleware/haveInit')

router.route('/')
.get(isLoggedIn, haveInit, mainController.getMain)

router.route('/signup')
.get(isLoggedOut, mainController.getSignup)
.post(mainController.postSignup)

router.route('/login')
.get(isLoggedOut, mainController.getLogin)
.post(passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}))

router.route('/changepassword')
.get(isLoggedIn, mainController.getChangePass)
.post(isLoggedIn, mainController.postChangePass)

router.route('/preference')
.get(isLoggedIn, haveInit, mainController.getPreference)
.post(isLoggedIn, haveInit, mainController.postPreference)
router.route('/logout')
.get(isLoggedIn, mainController.getLogout)

module.exports = router
