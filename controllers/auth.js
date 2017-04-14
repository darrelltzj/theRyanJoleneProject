var express = require('express');
var router = express.Router();

var User = require('../models/user')

router.route('/signup')
.get(function(req, res) {
  res.send('signup')
  // res.render('auth/signup');
})
.post(function (req, res) {
  var newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  })
  newUser.save(function(err, data) {
    if (err) return res.redirect('/signup')
    res.send('/')
    // res.redirect('/')
  })
})

router.route('/login')
.get(function (req, res) {
  res.send('login')
  // res.render('auth/login')
})
.post(function (req, res) {

})

module.exports = router;
