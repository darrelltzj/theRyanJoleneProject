const express = require('express')
const router = express.Router()
const mainController = require('../controllers/mainController')
const isLoggedIn = require('../middleware/isLoggedIn')
const isLoggedOut = require('../middleware/isLoggedOut')
const haveInit = require('../middleware/haveInit')

router.route('/')
.get(isLoggedIn, haveInit, mainController.getMain)

router.route('/login')
.get(isLoggedOut, mainController.getLogin)
.post(mainController.postLogin)

router.route('/changepassword')
.get(isLoggedIn, mainController.getChangePass)
.put(isLoggedIn, mainController.putChangePass)

router.route('/preference')
.get(isLoggedIn, haveInit, mainController.getPreference)
.put(isLoggedIn, haveInit, mainController.putPreference)

router.route('/logout')
.get(isLoggedIn, mainController.getLogout)

module.exports = router
